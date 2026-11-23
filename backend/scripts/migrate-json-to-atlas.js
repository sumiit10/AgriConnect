require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Rental = require('../models/Rental');

const legacyDir = path.join(__dirname, '..', '..', 'legacy-data');
function readLegacy(name) {
  const file = path.join(legacyDir, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(value)) throw new Error(`${name}.json must contain a JSON array.`);
  return value;
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing from .env.');
  await mongoose.connect(process.env.MONGODB_URI);
  const oldUsers = readLegacy('users');
  const oldEquipment = readLegacy('equipment');
  const oldRentals = readLegacy('rentals');
  const userIds = new Map();
  const equipmentIds = new Map();
  let createdUsers = 0, existingUsers = 0, createdEquipment = 0, skippedEquipment = 0, createdRentals = 0, skippedRentals = 0;

  for (const old of oldUsers) {
    let user = await User.findOne({ email: String(old.email || '').toLowerCase() });
    if (!user) {
      user = await User.create({
        name: old.name, email: String(old.email).toLowerCase(), phone: old.phone,
        location: old.location, role: old.role, passwordHash: old.passwordHash
      });
      createdUsers++;
    } else existingUsers++;
    userIds.set(old.id, user._id);
  }

  for (const old of oldEquipment) {
    const ownerId = userIds.get(old.ownerId);
    if (!ownerId) { skippedEquipment++; continue; }
    let item = await Equipment.findOne({ legacyId: old.id });
    if (!item) {
      item = await Equipment.create({
        legacyId: old.id, name: old.name, category: old.category, location: old.location,
        price: Number(old.price), brand: old.brand || '', condition: old.condition,
        fuel: old.fuel || '', icon: old.icon || '🚜', description: old.description,
        owner: ownerId, available: old.available !== false
      });
      createdEquipment++;
    } else skippedEquipment++;
    equipmentIds.set(old.id, item._id);
  }

  for (const old of oldRentals) {
    const equipmentId = equipmentIds.get(old.equipmentId);
    const renterId = userIds.get(old.renterId);
    const ownerId = userIds.get(old.ownerId);
    if (!equipmentId || !renterId || !ownerId) { skippedRentals++; continue; }
    const exists = await Rental.exists({ legacyId: old.id });
    if (exists) { skippedRentals++; continue; }
    await Rental.create({
      legacyId: old.id, equipment: equipmentId, equipmentName: old.equipmentName,
      renter: renterId, renterName: old.renterName, owner: ownerId, ownerName: old.ownerName,
      startDate: old.startDate, endDate: old.endDate, numberOfDays: old.numberOfDays,
      pricePerDay: old.pricePerDay, totalAmount: old.totalAmount, status: old.status || 'Pending'
    });
    createdRentals++;
  }

  console.log('Legacy migration completed:', { createdUsers, existingUsers, createdEquipment, skippedEquipment, createdRentals, skippedRentals });
}

run().catch(error => { console.error('Migration failed:', error); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
