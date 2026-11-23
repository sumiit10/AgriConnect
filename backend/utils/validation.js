const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORIES = ['Tractor', 'Cultivator', 'Irrigation', 'Harvester', 'Sprayer', 'Other Tools'];

function validateRegistration(body) {
  const value = {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim().toLowerCase(),
    phone: String(body.phone || '').trim(),
    location: String(body.location || '').trim(),
    role: String(body.role || ''),
    password: String(body.password || '')
  };
  const errors = {};
  if (value.name.length < 2 || value.name.length > 80) errors.name = 'Name must contain 2–80 characters.';
  if (!EMAIL_RE.test(value.email)) errors.email = 'Enter a valid email address.';
  if (!/^[6-9]\d{9}$/.test(value.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (value.location.length < 2 || value.location.length > 100) errors.location = 'Enter a valid location.';
  if (!['owner', 'renter'].includes(value.role)) errors.role = 'Select a valid account type.';
  if (value.password.length < 8 || value.password.length > 72) errors.password = 'Password must contain 8–72 characters.';
  if (value.password !== String(body.confirmPassword || '')) errors.confirmPassword = 'Passwords do not match.';
  return { value, errors };
}

function validateEquipment(body) {
  const value = {
    name: String(body.name || '').trim(),
    category: String(body.category || ''),
    location: String(body.location || '').trim(),
    price: Number(body.price),
    brand: String(body.brand || '').trim(),
    condition: String(body.condition || ''),
    fuel: String(body.fuel || '').trim(),
    icon: String(body.icon || '🚜').slice(0, 10),
    description: String(body.description || '').trim(),
    imageUrl: String(body.imageUrl || '').trim(),
    imagePublicId: String(body.imagePublicId || '').trim()
  };
  const errors = {};
  if (value.name.length < 3 || value.name.length > 80) errors.name = 'Equipment name must contain 3–80 characters.';
  if (!CATEGORIES.includes(value.category)) errors.category = 'Choose a valid category.';
  if (value.location.length < 2 || value.location.length > 100) errors.location = 'Enter a valid location.';
  if (!String(body.price ?? '').trim() || !Number.isFinite(value.price) || value.price <= 0 || value.price > 10000000) errors.price = 'Enter a valid daily price greater than zero.';
  if (!['Excellent', 'Good', 'Fair'].includes(value.condition)) errors.condition = 'Choose a valid condition.';
  if (value.description.length < 10 || value.description.length > 600) errors.description = 'Description must contain 10–600 characters.';
  if (value.brand.length > 100) errors.brand = 'Brand must not exceed 100 characters.';
  if (value.fuel.length > 50) errors.fuel = 'Fuel must not exceed 50 characters.';
  if (value.imageUrl && !/^https:\/\//i.test(value.imageUrl)) errors.imageUrl = 'Image URL must start with https://';
  return { value, errors };
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function overlaps(a1, a2, b1, b2) { return a1 <= b2 && b1 <= a2; }
function daysInclusive(start, end) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1;
}

module.exports = { EMAIL_RE, validateRegistration, validateEquipment, validDate, overlaps, daysInclusive };
