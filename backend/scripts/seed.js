require('../config/dns');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Equipment = require('../models/Equipment');

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing from .env.');
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash('Demo@12345', 12);

  let owner = await User.findOne({ email: 'owner.demo@agriconnect.local' });
  if (!owner) owner = await User.create({
    name: 'Demo Equipment Owner', email: 'owner.demo@agriconnect.local',
    phone: '9876543210', location: 'Pune', role: 'owner', passwordHash
  });
  let renter = await User.findOne({ email: 'renter.demo@agriconnect.local' });
  if (!renter) renter = await User.create({
    name: 'Demo Farmer', email: 'renter.demo@agriconnect.local',
    phone: '9876543211', location: 'Pune', role: 'renter', passwordHash
  });

  const sampleItems = [
    { name: 'Mahindra 575 DI Tractor', category: 'Tractor', location: 'Pune', price: 1500, brand: 'Mahindra', condition: 'Good', fuel: 'Diesel', icon: '🚜', description: 'Reliable tractor suitable for ploughing, transport and daily farm operations.', owner: owner._id },
    { name: 'John Deere Rotavator', category: 'Cultivator', location: 'Nashik', price: 900, brand: 'John Deere', condition: 'Excellent', fuel: 'Tractor mounted', icon: '🌱', description: 'Rotavator attachment for soil preparation and seedbed finishing.', owner: owner._id },
    { name: 'Portable Irrigation Pump', category: 'Irrigation', location: 'Ahmednagar', price: 650, brand: 'Kirloskar', condition: 'Good', fuel: 'Diesel', icon: '💧', description: 'Portable pump for moving water to small and medium agricultural plots.', owner: owner._id }
  ];
  for (const item of sampleItems) {
    const exists = await Equipment.exists({ name: item.name, owner: owner._id });
    if (!exists) await Equipment.create(item);
  }
  console.log('Demo data ready. Owner: owner.demo@agriconnect.local | Renter: renter.demo@agriconnect.local | Password: Demo@12345');
  await mongoose.disconnect();
}

run().catch(async error => { console.error(error); await mongoose.disconnect(); process.exit(1); });
