const mongoose = require('mongoose');

const CATEGORIES = ['Tractor', 'Cultivator', 'Irrigation', 'Harvester', 'Sprayer', 'Other Tools'];
const equipmentSchema = new mongoose.Schema({
  legacyId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  category: { type: String, required: true, enum: CATEGORIES, index: true },
  location: { type: String, required: true, trim: true, maxlength: 100, index: true },
  price: { type: Number, required: true, min: 1, max: 10000000 },
  brand: { type: String, trim: true, maxlength: 100, default: '' },
  condition: { type: String, required: true, enum: ['Excellent', 'Good', 'Fair'] },
  fuel: { type: String, trim: true, maxlength: 50, default: '' },
  icon: { type: String, default: '🚜', maxlength: 10 },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 600 },
  imageUrl: { type: String, trim: true, default: '' },
  imagePublicId: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  available: { type: Boolean, default: true, index: true },
  bookingLockVersion: { type: Number, default: 0, select: false }
}, { timestamps: true, versionKey: false });

equipmentSchema.index({ name: 'text', brand: 'text', description: 'text', location: 'text' });
module.exports = mongoose.model('Equipment', equipmentSchema);
module.exports.CATEGORIES = CATEGORIES;
