const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cấu hình Cloudinary Storage cho blog
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blogs', // thư mục trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const uploadBlogImages = multer({ storage }).array('images', 10);

module.exports = uploadBlogImages;
