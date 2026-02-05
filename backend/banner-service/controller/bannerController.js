const Banner = require('../model/Banner');
const Book = require('../../book-service/model/Book');
const Category = require('../../category-service/model/Category');

// --- Tạo banner ---
exports.createBanner = async (req, res) => {
  try {
    const { book_name, category_name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Chưa upload ảnh banner' });
    }

    // Lấy bookId từ tên book
    let bookId = null;
    if (book_name) {
      const book = await Book.findOne({ name: book_name });
      if (book) bookId = book._id;
    }

    // Lấy categoryId từ tên category
    let categoryId = null;
    if (category_name) {
      const category = await Category.findOne({ name: category_name });
      if (category) categoryId = category._id;
    }

    const newBanner = new Banner({
      bookId,
      categoryId,
      imageUrl: req.file.path
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Lấy tất cả banner ---
exports.getAllBanner = async (req, res) => {
  try {
    const banners = await Banner.find()
      .populate('bookId', 'name slug')
      .populate('categoryId', 'name slug');
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Lấy banner theo id ---
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
      .populate('bookId', 'name')
      .populate('categoryId', 'name');

    if (!banner) return res.status(404).json({ message: 'Banner không tồn tại' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// bannerController.js

exports.updateBanner = async (req, res) => {
  try {
    const { book_name, category_name } = req.body;
    const updateData = {};
    const bannerId = req.params.id; // Lấy ID của banner

    // 1. Xử lý cập nhật Book (Nếu có tên sách)
    if (book_name) {
      const book = await Book.findOne({ name: book_name });
      if (!book) {
        // Trả về lỗi 404 nếu không tìm thấy sách
        return res.status(404).json({ message: `Sách "${book_name}" không tồn tại` });
      }
      updateData.bookId = book._id;
    }

    // 2. Xử lý cập nhật Category (Nếu có tên danh mục)
    if (category_name) {
      const category = await Category.findOne({ name: category_name });
      if (!category) {
        // Trả về lỗi 404 nếu không tìm thấy danh mục
        return res.status(404).json({ message: `Danh mục "${category_name}" không tồn tại` });
      }
      updateData.categoryId = category._id;
    }

    // 3. Xử lý cập nhật ảnh (Nếu có file upload)
    if (req.file) {
      console.log('✅ File upload thành công:', req.file.path);
      updateData.imageUrl = req.file.path;
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Cần gửi ít nhất 1 trường (book_name, category_name hoặc imageUrl) để cập nhật' });
    }
    let updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('bookId', 'name slug')
      .populate('categoryId', 'name slug');

    if (!updatedBanner) {
      return res.status(404).json({ message: 'Banner không tồn tại hoặc ID không hợp lệ' });
    }

    res.json(updatedBanner);
  } catch (err) {
    // Xử lý lỗi Mongoose (ví dụ: CastError khi ID không đúng định dạng)
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: 'ID banner không hợp lệ',
        error: err.message
      });
    }

    // Log lỗi chi tiết trên server
    console.error('❌ Lỗi updateBanner:', err);
    // Trả về lỗi 500 với message rõ ràng hơn
    res.status(500).json({ message: 'Lỗi server khi cập nhật banner', error: err.message });
  }
};

// --- Xóa banner ---
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ message: 'Banner không tồn tại' });

    res.json({ message: 'Xóa banner thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
