function serializeUser(user) {
  if (!user) return null;
  return {
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    role: user.role,
    avatarUrl: user.avatarUrl || ''
  };
}

function serializeEquipment(item) {
  if (!item) return null;
  return {
    id: String(item._id || item.id),
    name: item.name,
    category: item.category,
    location: item.location,
    price: item.price,
    brand: item.brand || '',
    condition: item.condition,
    fuel: item.fuel || '',
    icon: item.icon || '🚜',
    description: item.description,
    imageUrl: item.imageUrl || '',
    imagePublicId: item.imagePublicId || '',
    ownerId: String(item.owner?._id || item.owner || item.ownerId || ''),
    ownerName: item.owner?.name || item.ownerName || 'AgriConnect farmer',
    available: item.available !== false,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

function serializeRental(rental) {
  if (!rental) return null;
  return {
    id: String(rental._id || rental.id),
    equipmentId: String(rental.equipment?._id || rental.equipment || rental.equipmentId || ''),
    equipmentName: rental.equipmentName,
    renterId: String(rental.renter?._id || rental.renter || rental.renterId || ''),
    renterName: rental.renterName,
    ownerId: String(rental.owner?._id || rental.owner || rental.ownerId || ''),
    ownerName: rental.ownerName,
    startDate: rental.startDate,
    endDate: rental.endDate,
    numberOfDays: rental.numberOfDays,
    pricePerDay: rental.pricePerDay,
    totalAmount: rental.totalAmount,
    status: rental.status,
    createdAt: rental.createdAt,
    updatedAt: rental.updatedAt
  };
}

module.exports = { serializeUser, serializeEquipment, serializeRental };
