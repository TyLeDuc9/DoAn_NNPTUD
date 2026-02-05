const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'bookdetails',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const uploadBookImages = multer({ storage }).array('images', 100);

module.exports = uploadBookImages;
