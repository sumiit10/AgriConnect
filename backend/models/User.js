const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  location: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  role: { type: String, required: true, enum: ['owner', 'renter'] },
  passwordHash: { type: String, required: true, select: false },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('User', userSchema);
