require('./config/dns');
require('dotenv').config();

const path = require('node:path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const helmet = require('helmet');
const connectDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const clientDist = path.join(__dirname, '..', 'client', 'dist');

app.disable('x-powered-by');
if (isProduction || process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
const defaultCsp = helmet.contentSecurityPolicy.getDefaultDirectives();
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      ...defaultCsp,
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'style-src': [...defaultCsp['style-src'], 'https://fonts.googleapis.com'],
      'font-src': [...defaultCsp['font-src'], 'https://fonts.gstatic.com']
    }
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  if (isProduction) throw new Error('SESSION_SECRET must be set to a random value of at least 32 characters in production.');
  console.warn('Warning: set SESSION_SECRET in your local .env before using real accounts.');
}

app.use(session({
  name: 'agriconnect.sid',
  secret: process.env.SESSION_SECRET || 'local-development-only-secret-change-me-123456789',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: mongoose.connection.asPromise().then(connection => connection.getClient()),
    collectionName: 'sessions',
    ttl: 2 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 2 * 60 * 60 * 1000
  }
}));

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ok' : 'degraded',
    application: 'AgriConnect',
    database: databaseReady ? 'connected' : 'disconnected'
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api', (req, res) => res.status(404).json({ message: 'API endpoint not found.' }));

if (require('node:fs').existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false, maxAge: isProduction ? '1d' : 0 }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.status(200).send('AgriConnect API is running. Start the React client on port 5173.'));
}

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.name === 'ValidationError') {
    const errors = Object.fromEntries(Object.entries(error.errors || {}).map(([key, value]) => [key, value.message]));
    return res.status(400).json({ message: 'Database validation failed.', errors });
  }
  if (error.code === 11000) return res.status(409).json({ message: 'A record with this value already exists.' });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid resource identifier.' });
  if (error.name === 'MulterError' || /Only JPG|Choose an image|image/i.test(error.message || '')) {
    return res.status(400).json({ message: error.message || 'Invalid image upload.' });
  }
  return res.status(error.status || 500).json({ message: error.status ? error.message : 'Unexpected server error.' });
});

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => console.log(`AgriConnect API running at http://localhost:${PORT}`));
  } catch (error) {
    console.error('Unable to start AgriConnect:', error.message);
    process.exit(1);
  }
}

if (require.main === module) start();
module.exports = { app, start };
