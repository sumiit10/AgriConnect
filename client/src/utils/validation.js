export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[6-9]\d{9}$/;

export function validateRegistration(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const location = values.location.trim();

  if (name.length < 2 || name.length > 80) errors.name = 'Name must contain 2–80 characters.';
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (!PHONE_RE.test(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (location.length < 2 || location.length > 100) errors.location = 'Location must contain 2–100 characters.';
  if (!['owner', 'renter'].includes(values.role)) errors.role = 'Please select an account type.';
  if (values.password.length < 8 || values.password.length > 72) errors.password = 'Password must contain 8–72 characters.';
  if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  if (!values.terms) errors.terms = 'Please confirm that your details are correct.';
  return errors;
}

export function validateLogin(values) {
  const errors = {};
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  return errors;
}

export function validateEquipment(values) {
  const errors = {};
  const name = values.name.trim();
  const location = values.location.trim();
  const description = values.description.trim();
  const price = Number(values.price);
  const categories = ['Tractor', 'Cultivator', 'Irrigation', 'Harvester', 'Sprayer', 'Other Tools'];

  if (name.length < 3 || name.length > 80) errors.name = 'Equipment name must contain 3–80 characters.';
  if (!categories.includes(values.category)) errors.category = 'Choose a valid category.';
  if (location.length < 2 || location.length > 100) errors.location = 'Location must contain 2–100 characters.';
  if (String(values.price).trim() === '' || !Number.isFinite(price) || price <= 0 || price > 10000000) {
    errors.price = 'Enter a daily price greater than ₹0 and no greater than ₹1,00,00,000.';
  }
  if (!['Excellent', 'Good', 'Fair'].includes(values.condition)) errors.condition = 'Choose the equipment condition.';
  if (description.length < 10 || description.length > 600) errors.description = 'Description must contain 10–600 characters.';
  if (values.brand.trim().length > 100) errors.brand = 'Brand must not exceed 100 characters.';
  if (values.fuel.trim().length > 50) errors.fuel = 'Fuel/type must not exceed 50 characters.';
  if (values.imageUrl && !/^https:\/\//i.test(values.imageUrl.trim())) errors.imageUrl = 'Image URL must start with https://';
  return errors;
}

export function validateRental(values) {
  const errors = {};
  if (!values.startDate) errors.startDate = 'Select a start date.';
  if (!values.endDate) errors.endDate = 'Select an end date.';
  if (values.startDate && values.startDate < values.today) errors.startDate = 'Start date cannot be in the past.';
  if (values.startDate && values.endDate && values.endDate < values.startDate) {
    errors.endDate = 'End date must be on or after the start date.';
  }
  if (values.startDate && values.endDate && values.endDate >= values.startDate) {
    const days = Math.round((Date.parse(`${values.endDate}T00:00:00Z`) - Date.parse(`${values.startDate}T00:00:00Z`)) / 86400000) + 1;
    if (days > 365) errors.endDate = 'Rental period cannot exceed 365 days.';
  }
  return errors;
}
