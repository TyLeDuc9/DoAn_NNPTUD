const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: false
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    },
    imageUrl: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
