const express = require('express');
const multer = require('multer');
const { requireLogin, requireOwner } = require('../middleware/auth');
const { uploadImage, isCloudinaryConfigured } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new Error('Only JPG, PNG and WebP images are allowed.'));
    }
    callback(null, true);
  }
});

router.post('/equipment-image', requireLogin, requireOwner, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose an image file first.' });
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Image upload is not configured. Add your Cloudinary credentials to the root .env file, or paste a hosted image URL into the equipment form.' });
    }
    const result = await uploadImage(req.file.buffer);
    return res.status(201).json({ message: 'Image uploaded.', imageUrl: result.secureUrl, imagePublicId: result.publicId });
  } catch (error) { next(error); }
});

module.exports = router;
