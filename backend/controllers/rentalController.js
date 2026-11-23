const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const Rental = require('../models/Rental');
const { validDate, daysInclusive } = require('../utils/validation');
const { serializeRental } = require('../utils/serializers');

async function create(req, res, next) {
  try {
    const equipmentId = String(req.body.equipmentId || '');
    const startDate = String(req.body.startDate || '');
    const endDate = String(req.body.endDate || '');
    const errors = {};
    if (!mongoose.isValidObjectId(equipmentId)) errors.equipmentId = 'Select valid equipment.';
    if (!validDate(startDate)) errors.startDate = 'Enter a valid start date.';
    if (!validDate(endDate)) errors.endDate = 'Enter a valid end date.';
    const today = new Date().toISOString().slice(0, 10);
    if (validDate(startDate) && startDate < today) errors.startDate = 'Start date cannot be in the past.';
    if (validDate(startDate) && validDate(endDate) && endDate < startDate) errors.endDate = 'End date must be on or after the start date.';
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Invalid rental request.', errors });

    const equipment = await Equipment.findById(equipmentId).populate('owner', 'name');
    if (!equipment) return res.status(404).json({ message: 'Equipment not found.' });
    if (!equipment.available) return res.status(409).json({ message: 'Equipment is unavailable.' });
    if (String(equipment.owner._id) === req.session.user.id) return res.status(403).json({ message: 'You cannot rent your own equipment.' });

    const numberOfDays = daysInclusive(startDate, endDate);
    if (numberOfDays < 1 || numberOfDays > 365) return res.status(400).json({ message: 'Rental period must be 1–365 days.' });
    const conflict = await Rental.exists({
      equipment: equipment._id, status: 'Accepted',
      startDate: { $lte: endDate }, endDate: { $gte: startDate }
    });
    if (conflict) return res.status(409).json({ message: 'Selected dates overlap an accepted rental.' });

    const rental = await Rental.create({
      equipment: equipment._id,
      equipmentName: equipment.name,
      renter: req.session.user.id,
      renterName: req.session.user.name,
      owner: equipment.owner._id,
      ownerName: equipment.owner.name,
      startDate, endDate, numberOfDays,
      pricePerDay: equipment.price,
      totalAmount: numberOfDays * equipment.price,
      status: 'Pending'
    });
    return res.status(201).json({ message: 'Rental request submitted.', rental: serializeRental(rental) });
  } catch (error) { next(error); }
}

async function mine(req, res, next) {
  try {
    const userId = req.session.user.id;
    const [sent, received] = await Promise.all([
      Rental.find({ renter: userId }).sort({ createdAt: -1 }).lean(),
      Rental.find({ owner: userId }).sort({ createdAt: -1 }).lean()
    ]);
    return res.json({ sent: sent.map(serializeRental), received: received.map(serializeRental) });
  } catch (error) { next(error); }
}

async function updateStatus(req, res, next) {
  const allowed = ['Accepted', 'Rejected', 'Cancelled'];
  const status = String(req.body.status || '');
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid rental status.' });
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Rental request not found.' });

  const session = await mongoose.startSession();
  try {
    let updatedRental;
    await session.withTransaction(async () => {
      const rental = await Rental.findById(req.params.id).session(session);
      if (!rental) {
        const error = new Error('Rental request not found.'); error.status = 404; throw error;
      }
      const uid = req.session.user.id;
      if (rental.status !== 'Pending') {
        const error = new Error('Only pending requests can be changed.'); error.status = 409; throw error;
      }
      if (status === 'Cancelled' && String(rental.renter) !== uid) {
        const error = new Error('You can only cancel your own requests.'); error.status = 403; throw error;
      }
      if (status !== 'Cancelled' && String(rental.owner) !== uid) {
        const error = new Error('Only the equipment owner can respond.'); error.status = 403; throw error;
      }
      if (status === 'Accepted') {
        // Force competing accept operations for the same equipment to contend on one document.
        // If two requests are accepted concurrently, MongoDB's transaction retry makes the later
        // transaction re-check the already-accepted date range.
        await Equipment.updateOne({ _id: rental.equipment }, { $inc: { bookingLockVersion: 1 } }, { session });
        const conflict = await Rental.exists({
          _id: { $ne: rental._id }, equipment: rental.equipment, status: 'Accepted',
          startDate: { $lte: rental.endDate }, endDate: { $gte: rental.startDate }
        }).session(session);
        if (conflict) {
          const error = new Error('Another accepted rental overlaps these dates.'); error.status = 409; throw error;
        }
      }
      rental.status = status;
      await rental.save({ session });
      updatedRental = rental.toObject();
    });
    return res.json({ message: `Request ${status.toLowerCase()}.`, rental: serializeRental(updatedRental) });
  } catch (error) { next(error); }
  finally { await session.endSession(); }
}

module.exports = { create, mine, updateStatus };
