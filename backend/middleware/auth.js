function requireLogin(req, res, next) {
  if (!req.session?.user) return res.status(401).json({ message: 'Please log in first.' });
  next();
}

function requireOwner(req, res, next) {
  if (req.session?.user?.role !== 'owner') {
    return res.status(403).json({ message: 'An equipment owner account is required.' });
  }
  next();
}

module.exports = { requireLogin, requireOwner };
