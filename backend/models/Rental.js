const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  legacyId: { type: String, unique: true, sparse: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true, index: true },
  equipmentName: { type: String, required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  renterName: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ownerName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  numberOfDays: { type: Number, required: true, min: 1, max: 365 },
  pricePerDay: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'], default: 'Pending', index: true }
}, { timestamps: true, versionKey: false });

rentalSchema.index({ equipment: 1, status: 1, startDate: 1, endDate: 1 });
module.exports = mongoose.model('Rental', rentalSchema);
