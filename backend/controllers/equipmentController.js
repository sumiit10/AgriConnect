const Equipment = require('../models/Equipment');
const Rental = require('../models/Rental');
const { validateEquipment } = require('../utils/validation');
const { serializeEquipment } = require('../utils/serializers');
const { cloudinary, configureCloudinary, isCloudinaryConfigured } = require('../utils/cloudinary');

async function removeCloudinaryImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return;
  try { configureCloudinary(); await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }); }
  catch (error) { console.error('Could not remove old Cloudinary image:', error.message); }
}

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function list(req, res, next) {
  try {
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const location = String(req.query.location || '').trim();
    const filter = { available: true };
    if (category) filter.category = category;
    if (location) filter.location = { $regex: escapeRegex(location), $options: 'i' };
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { brand: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { location: { $regex: safeSearch, $options: 'i' } }
      ];
    }
    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      name: { name: 1 },
      newest: { createdAt: -1 }
    };
    const rows = await Equipment.find(filter)
      .populate('owner', 'name location')
      .sort(sortMap[String(req.query.sort || '')] || { createdAt: -1 })
      .limit(100)
      .lean();
    return res.json({ equipment: rows.map(serializeEquipment) });
  } catch (error) { next(error); }
}

async function mine(req, res, next) {
  try {
    const rows = await Equipment.find({ owner: req.session.user.id }).populate('owner', 'name').sort({ createdAt: -1 }).lean();
    return res.json({ equipment: rows.map(serializeEquipment) });
  } catch (error) { next(error); }
}

async function getById(req, res, next) {
  try {
    const item = await Equipment.findById(req.params.id).populate('owner', 'name location').lean();
    if (!item) return res.status(404).json({ message: 'Equipment not found.' });
    return res.json({ equipment: serializeEquipment(item) });
  } catch (error) { next(error); }
}

async function create(req, res, next) {
  try {
    const { value, errors } = validateEquipment(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Invalid equipment details.', errors });
    const item = await Equipment.create({ ...value, owner: req.session.user.id });
    const populated = await item.populate('owner', 'name');
    return res.status(201).json({ message: 'Equipment added.', equipment: serializeEquipment(populated) });
  } catch (error) { next(error); }
}

async function update(req, res, next) {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Equipment not found.' });
    if (String(item.owner) !== req.session.user.id) return res.status(403).json({ message: 'You can only edit your own equipment.' });
    const { value, errors } = validateEquipment(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Invalid equipment details.', errors });
    const previousImagePublicId = item.imagePublicId;
    Object.assign(item, value);
    await item.save();
    if (previousImagePublicId && previousImagePublicId !== item.imagePublicId) {
      await removeCloudinaryImage(previousImagePublicId);
    }
    await item.populate('owner', 'name');
    return res.json({ message: 'Equipment updated.', equipment: serializeEquipment(item) });
  } catch (error) { next(error); }
}

async function remove(req, res, next) {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Equipment not found.' });
    if (String(item.owner) !== req.session.user.id) return res.status(403).json({ message: 'You can only delete your own equipment.' });
    const activeRental = await Rental.exists({ equipment: item._id, status: { $in: ['Pending', 'Accepted'] } });
    if (activeRental) return res.status(409).json({ message: 'Resolve pending or accepted rentals before deleting this equipment.' });
    await item.deleteOne();
    await removeCloudinaryImage(item.imagePublicId);
    return res.json({ message: 'Equipment deleted.' });
  } catch (error) { next(error); }
}

module.exports = { list, mine, getById, create, update, remove };
