const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validateRegistration, EMAIL_RE } = require('../utils/validation');
const { serializeUser } = require('../utils/serializers');

async function register(req, res, next) {
  try {
    const { value, errors } = validateRegistration(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
    const existing = await User.findOne({ email: value.email }).lean();
    if (existing) return res.status(409).json({ message: 'This email is already registered.', errors: { email: 'An account with this email already exists.' } });
    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await User.create({
      name: value.name, email: value.email, phone: value.phone,
      location: value.location, role: value.role, passwordHash
    });
    return res.status(201).json({ message: 'Registration successful.', user: serializeUser(user) });
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const errors = {};
    if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Invalid login details.', errors });

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    req.session.regenerate(error => {
      if (error) return next(error);
      req.session.user = serializeUser(user);
      req.session.save(saveError => {
        if (saveError) return next(saveError);
        return res.json({ message: 'Login successful.', user: req.session.user });
      });
    });
  } catch (error) { next(error); }
}

function me(req, res) {
  return res.json({ user: req.session.user || null });
}

function logout(req, res, next) {
  req.session.destroy(error => {
    if (error) return next(error);
    res.clearCookie('agriconnect.sid');
    return res.json({ message: 'Logged out.' });
  });
}

async function updateProfile(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();
    const location = String(req.body.location || '').trim();
    const errors = {};
    if (name.length < 2 || name.length > 80) errors.name = 'Name must contain 2–80 characters.';
    if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (location.length < 2 || location.length > 100) errors.location = 'Enter a valid location.';
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Invalid profile details.', errors });
    const user = await User.findByIdAndUpdate(req.session.user.id, { name, phone, location }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User account not found.' });
    req.session.user = serializeUser(user);
    return res.json({ message: 'Profile updated.', user: req.session.user });
  } catch (error) { next(error); }
}

module.exports = { register, login, me, logout, updateProfile };
