const { v2: cloudinary } = require('cloudinary');

function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) return false;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  return true;
}

function uploadImage(buffer, folder = 'agriconnect/equipment') {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const { Readable } = require('node:stream');
    const upload = cloudinary.uploader.upload_stream({
      folder,
      resource_type: 'image',
      transformation: [{ width: 1400, height: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
    }, (error, result) => {
      if (error) return reject(error);
      resolve({ secureUrl: result.secure_url, publicId: result.public_id });
    });
    Readable.from(buffer).pipe(upload);
  });
}

module.exports = { cloudinary, configureCloudinary, isCloudinaryConfigured, uploadImage };
