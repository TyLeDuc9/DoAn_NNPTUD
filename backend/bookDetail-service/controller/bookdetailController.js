const BookDetail = require('../model/BookDetail');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');
const { applyBookDiscount } = require("../utils/bookDiscount");
const mongoose = require('mongoose');
const BookDiscount = mongoose.model('BookDiscount', require('../../bookDiscount-service/model/BookDiscount').schema);
const Category = mongoose.model('Category', require('../../category-service/model/Category').schema);
const Book = mongoose.model('Book', require('../../book-service/model/Book').schema);
const Publisher = mongoose.model('Publisher', require('../../publisher-service/model/Publisher').schema);
const Author = mongoose.model('Author', require('../../author-service/model/Author').schema);


exports.updateBookDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 🟩 Lấy danh sách ảnh cũ còn giữ lại
    let oldImages = [];
    if (req.body.oldImages) {
      oldImages = Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages];
    }

    // 🟩 Ảnh mới upload (CloudinaryStorage tự trả về link thật)
    let newImagePaths = [];
    if (req.files && req.files.length > 0) {
      newImagePaths = req.files.map((file) => file.path); // ✅ Cloudinary trả về file.path là URL thật
    }

    // 🟩 Lấy dữ liệu hiện tại
    const currentDetail = await BookDetail.findById(id);
    if (!currentDetail) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết sách" });
    }

    // 🟩 Xác định ảnh bị xóa
    const removedImages = currentDetail.images.filter(
      (img) => !oldImages.includes(img)
    );

    // 🟩 Nếu ảnh bị xóa là Cloudinary URL → xóa luôn trên Cloudinary
    for (const imgUrl of removedImages) {
      try {
        const publicId = imgUrl.split("/").slice(-1)[0].split(".")[0]; // Lấy ID file
        await cloudinary.uploader.destroy(`bookdetails/${publicId}`);
      } catch (err) {
        console.warn("Không thể xóa ảnh Cloudinary:", imgUrl, err.message);
      }
    }

    // 🟩 Cập nhật mảng ảnh (ảnh giữ lại + ảnh mới upload)
    updateData.images = [...oldImages, ...newImagePaths];

    // 🟩 Cập nhật dữ liệu khác
    const updatedBookDetail = await BookDetail.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Cập nhật chi tiết sách thành công",
      bookDetail: updatedBookDetail,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật chi tiết sách:", error);
    res.status(500).json({
      message: "Lỗi server khi cập nhật chi tiết sách",
      error: error.message,
    });
  }
};
exports.getBookDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm chi tiết sách theo ID, đồng thời populate để lấy thông tin sách cha (Book)
    const bookDetail = await BookDetail.findById(id)
      .populate({
        path: 'book_id',
        select: 'name description category_id author_id publisher_id slug',
        populate: [
          { path: 'category_id', select: 'name' },
          { path: 'author_id', select: 'name' },
          { path: 'publisher_id', select: 'name' }
        ]
      });

    if (!bookDetail) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiết sách' });
    }

    res.status(200).json({
      message: 'Lấy chi tiết sách thành công',
      bookDetail
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sách:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết sách', error: error.message });
  }
};


exports.deleteBookDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BookDetail.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy chi tiết sách' });
    }

    res.status(200).json({ message: 'Xóa chi tiết sách thành công' });
  } catch (error) {
    console.error("Lỗi khi xóa chi tiết sách:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query; // từ khóa search
    if (!q) return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || "newest";

    // Map kiểu sort sang MongoDB sort
    let sortOption = {};
    switch (sortBy) {
      case "newest":
        sortOption = { "details.createdAt": -1 };
        break;
      case "oldest":
        sortOption = { "details.createdAt": 1 };
        break;
      case "a-z":
        sortOption = { name: 1 };
        break;
      case "z-a":
        sortOption = { name: -1 };
        break;
      case "price-asc":
        sortOption = { "details.price": 1 };
        break;
      case "price-desc":
        sortOption = { "details.price": -1 };
        break;
      default:
        sortOption = { "details.createdAt": -1 };
    }

    // Lấy discount active
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    // Đếm tổng sách khớp search
    const totalBooksAgg = await Book.aggregate([
      { $match: { name: { $regex: q, $options: "i" } } },
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },
      { $count: "total" }
    ]);
    const totalBooks = totalBooksAgg.length > 0 ? totalBooksAgg[0].total : 0;

    // Lấy sách có phân trang + sort
    const books = await Book.aggregate([
      { $match: { name: { $regex: q, $options: "i" } } },
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },
      { $sort: sortOption },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          price: "$details.price",
          images: { $arrayElemAt: ["$details.images", 0] },
          volume: "$details.volume",
          createdAt: "$details.createdAt"
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Áp dụng discount
    const booksWithDiscount = books.map(book => applyBookDiscount(book, discount));

    res.status(200).json({
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit)
      },
      books: booksWithDiscount
    });
  } catch (error) {
    console.error("❌ Error searchBooks:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// BUY NOW CHECKOUT (mua ngay không cần giỏ hàng)
exports.buyNowCheckout = async (req, res) => {
  try {
    const { userId, guestId, bookdetailId, quantity } = req.body;

    if (!bookdetailId || !quantity) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
    }

    // 1️⃣ Lấy BookDetail kèm Book
    const detail = await BookDetail.findById(bookdetailId).populate("book_id");
    if (!detail) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết sách" });
    }

    // 2️⃣ Tìm discount đang active (nếu có)
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // 3️⃣ Áp dụng discount (nếu có)
    const detailWithDiscount = applyBookDiscount(detail.toObject(), discount);
    const price = detailWithDiscount.discountedPrice || detailWithDiscount.price;

    // 4️⃣ Kiểm tra tồn kho
    if (quantity > detail.stock_quantity) {
      return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
    }

    // 5️⃣ Chuẩn bị dữ liệu checkout trả về FE
    const response = {
      items: [
        {
          bookdetailId: detail._id,
          name: detail.book_id.name,
          image: detail.images?.[0],
          price,
          quantity,
          volume: detail.volume,
          cover_type: detail.cover_type,
        }
      ],
      totalPrice: price * quantity,
      userId,
      guestId,
      activeDiscount: discount || null
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error buyNowCheckout:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
exports.getRelatedBooks = async (req, res) => {
  try {
    const { id, slug } = req.params;

    // Tìm sách gốc
    const book = await Book.findOne({ _id: id, slug });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    const relatedBooks = await Book.aggregate([
      {
        $match: {
          category_id: { $in: book.category_id }, // ✅ fix
          _id: { $ne: book._id }
        }
      },
      {
        $lookup: {
          from: "bookdetails",
          localField: "_id",
          foreignField: "book_id",
          as: "details"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          details: {
            $map: {
              input: "$details",
              as: "d",
              in: {
                _id: "$$d._id",
                images: "$$d.images",
                price: "$$d.price",
                volume: "$$d.volume",
                createdAt: "$$d.createdAt"
              }
            }
          }
        }
      },
      {
        $addFields: {
          latestCreatedAt: { $max: "$details.createdAt" }
        }
      },
      { $sort: { latestCreatedAt: -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      relatedBooks
    });

  } catch (error) {
    console.error("❌ Error getRelatedBooks:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
//LAY TAT CA SACH THEO NXB
exports.getAllBooksByPublisher = async (req, res) => {
  try {
    const { id, slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || "newest";
    const search = req.query.search || "";
    const priceRange = req.query.priceRange || "all";

    // Map sort option
    let sortOption = {};
    switch (sortBy) {
      case "newest": sortOption = { "details.createdAt": -1 }; break;
      case "oldest": sortOption = { "details.createdAt": 1 }; break;
      case "a-z": sortOption = { name: 1 }; break;
      case "z-a": sortOption = { name: -1 }; break;
      case "price-asc": sortOption = { "details.price": 1 }; break;
      case "price-desc": sortOption = { "details.price": -1 }; break;
      default: sortOption = { "details.createdAt": -1 };
    }

    // 1️⃣ Tìm publisher
    const publisher = await Publisher.findOne({ _id: id, slug });
    if (!publisher) return res.status(404).json({ message: "Nhà xuất bản không tồn tại" });

    // 2️⃣ Discount active (áp dụng toàn bộ sách)
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // 3️⃣ Build điều kiện lọc
    let matchConditions = { publisher_id: publisher._id };

    if (search) {
      matchConditions.name = { $regex: search, $options: "i" };
    }

    let priceCondition = {};
    switch (priceRange) {
      case "lt-100": priceCondition = { "details.price": { $lt: 100000 } }; break;
      case "100-200": priceCondition = { "details.price": { $gte: 100000, $lte: 200000 } }; break;
      case "200-300": priceCondition = { "details.price": { $gte: 200000, $lte: 300000 } }; break;
      case "300-400": priceCondition = { "details.price": { $gte: 300000, $lte: 400000 } }; break;
      case "400-500": priceCondition = { "details.price": { $gte: 400000, $lte: 500000 } }; break;
      case "gt-500": priceCondition = { "details.price": { $gt: 500000 } }; break;
      default: break; // all
    }

    // 4️⃣ Đếm tổng sách
    const totalBooksAgg = await Book.aggregate([
      { $match: matchConditions },
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },
      ...(Object.keys(priceCondition).length > 0 ? [{ $match: priceCondition }] : []),
      { $count: "total" },
    ]);
    const totalBooks = totalBooksAgg.length > 0 ? totalBooksAgg[0].total : 0;

    // 5️⃣ Lấy sách
    const books = await Book.aggregate([
      { $match: matchConditions },
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },
      ...(Object.keys(priceCondition).length > 0 ? [{ $match: priceCondition }] : []),
      { $sort: sortOption },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          images: "$details.images",
          price: "$details.price",
          volume: "$details.volume",
          createdAt: "$details.createdAt",
        }
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    // 6️⃣ Áp dụng discount
    const booksWithDiscount = books.map(book => applyBookDiscount(book, discount));

    // 7️⃣ Trả về JSON
    res.status(200).json({
      publisher: { id: publisher._id, name: publisher.name, slug: publisher.slug },
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
      },
      books: booksWithDiscount,
      activeDiscount: discount || null,
    });

  } catch (error) {
    console.error("❌ Error getAllBooksByPublisher:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
exports.getAllBookDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || "newest";
    const priceRange = req.query.priceRange || "all";

    // --- Sort Option ---
    let sortOption = {};
    switch (sortBy) {
      case "newest": sortOption = { "details.createdAt": -1 }; break;
      case "oldest": sortOption = { "details.createdAt": 1 }; break;
      case "a-z": sortOption = { name: 1 }; break;
      case "z-a": sortOption = { name: -1 }; break;
      case "price-asc": sortOption = { "details.price": 1 }; break;
      case "price-desc": sortOption = { "details.price": -1 }; break;
      default: sortOption = { "details.createdAt": -1 };
    }

    // --- Price Filter ---
    let priceFilter = {};
    switch (priceRange) {
      case "lt-100": priceFilter = { "details.price": { $lt: 100000 } }; break;
      case "100-200": priceFilter = { "details.price": { $gte: 100000, $lte: 200000 } }; break;
      case "200-300": priceFilter = { "details.price": { $gte: 200000, $lte: 300000 } }; break;
      case "300-400": priceFilter = { "details.price": { $gte: 300000, $lte: 400000 } }; break;
      case "400-500": priceFilter = { "details.price": { $gte: 400000, $lte: 500000 } }; break;
      case "gt-500": priceFilter = { "details.price": { $gt: 500000 } }; break;
      default: priceFilter = {};
    }

    // --- Get Active Discount ---
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // --- Count Total Books ---
    const totalBooksAgg = await Book.aggregate([
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },
      { $match: priceFilter },
      { $count: "total" },
    ]);
    const totalBooks = totalBooksAgg.length > 0 ? totalBooksAgg[0].total : 0;

    // --- Get Books ---
    const books = await Book.aggregate([
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },

      // Lấy category, author, publisher
      { $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "categories" } },
      { $lookup: { from: "authors", localField: "author_id", foreignField: "_id", as: "authors" } },
      { $lookup: { from: "publishers", localField: "publisher_id", foreignField: "_id", as: "publisher" } },
      { $unwind: { path: "$publisher", preserveNullAndEmptyArrays: true } },

      { $match: priceFilter },
      { $sort: sortOption },

      {
        $project: {
          _id: 1,
          bookdetail_Id: "$details._id",
          name: 1,
          slug: 1,
          description: 1,
          categories: "$categories.name", // mảng danh mục
          authors: "$authors.name",       // mảng tác giả
          publisher: "$publisher.name",
          price: "$details.price",
          images: "$details.images",
          isbn: "$details.isbn",
          stock_quantity: "$details.stock_quantity",
          edition: "$details.edition",
          pages: "$details.pages",
          language: "$details.language",
          publication_year: "$details.publication_year",
          cover_type: "$details.cover_type",
          volume: "$details.volume",
          weight: "$details.weight",
          dimensions: "$details.dimensions",
          createdAt: "$details.createdAt",
          updatedAt: "$details.updatedAt"
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);


    // --- Apply Discount ---
    const booksWithDiscount = books.map((book) =>
      applyBookDiscount(book, discount)
    );

    res.status(200).json({
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
      },
      books: booksWithDiscount,
    });
  } catch (error) {
    console.error("❌ Error getAllBooks:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
exports.getAllBooksByCategory = async (req, res) => {
  try {
    const { id, slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || "newest";
    const priceRange = req.query.priceRange; // vd: "lt-100", "100-200", "gt-500"
    const keyword = req.query.keyword?.trim(); // tìm theo tên sách

    // Map kiểu sort sang MongoDB sort
    let sortOption = {};
    switch (sortBy) {
      case "newest":
        sortOption = { "details.createdAt": -1 };
        break;
      case "oldest":
        sortOption = { "details.createdAt": 1 };
        break;
      case "a-z":
        sortOption = { name: 1 };
        break;
      case "z-a":
        sortOption = { name: -1 };
        break;
      case "price-asc":
        sortOption = { "details.price": 1 };
        break;
      case "price-desc":
        sortOption = { "details.price": -1 };
        break;
      default:
        sortOption = { "details.createdAt": -1 };
    }

    const category = await Category.findOne({ _id: id, slug });
    if (!category) return res.status(404).json({ message: "Danh mục không tồn tại" });

    // Lấy discount active áp dụng toàn bộ sách
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    // Tạo pipeline match
    let matchStage = { category_id: category._id };

    // Nếu có keyword
    if (keyword) {
      matchStage.name = { $regex: keyword, $options: "i" };
    }

    // Bắt đầu pipeline
    const basePipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "bookdetails",
          localField: "_id",
          foreignField: "book_id",
          as: "details"
        }
      },
      { $unwind: "$details" }
    ];

    // Thêm filter khoảng giá
    if (priceRange && priceRange !== "all") {
      let priceCondition = {};
      switch (priceRange) {
        case "lt-100":
          priceCondition = { "details.price": { $lt: 100000 } };
          break;
        case "100-200":
          priceCondition = { "details.price": { $gte: 100000, $lte: 200000 } };
          break;
        case "200-300":
          priceCondition = { "details.price": { $gte: 200000, $lte: 300000 } };
          break;
        case "300-400":
          priceCondition = { "details.price": { $gte: 300000, $lte: 400000 } };
          break;
        case "400-500":
          priceCondition = { "details.price": { $gte: 400000, $lte: 500000 } };
          break;
        case "gt-500":
          priceCondition = { "details.price": { $gt: 500000 } };
          break;
      }
      basePipeline.push({ $match: priceCondition });
    }

    // Đếm tổng sách
    const totalBooksAgg = await Book.aggregate([
      ...basePipeline,
      { $count: "total" }
    ]);
    const totalBooks = totalBooksAgg.length > 0 ? totalBooksAgg[0].total : 0;

    // Lấy danh sách sách
    const books = await Book.aggregate([
      ...basePipeline,
      { $sort: sortOption },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          category_id: 1,
          images: "$details.images",
          price: "$details.price",
          volume: "$details.volume",
          createdAt: "$details.createdAt"
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Áp dụng discount
    const booksWithDiscount = books.map(book => applyBookDiscount(book, discount));

    res.status(200).json({
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug
      },
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit)
      },
      books: booksWithDiscount
    });

  } catch (error) {
    console.error("❌ Error getBooksByCategory:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
exports.getRandomBooks = async (req, res) => {
  try {
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    const books = await Book.aggregate([
      { $lookup: { from: "bookdetails", localField: "_id", foreignField: "book_id", as: "details" } },
      { $unwind: "$details" },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          images: "$details.images",
          price: "$details.price",
          volume: "$details.volume",
          createdAt: "$details.createdAt"
        }
      },
      { $sample: { size: 10 } }
    ]);

    const booksWithDiscount = books.map(book => applyBookDiscount(book, discount));

    res.status(200).json(booksWithDiscount);
  } catch (error) {
    console.error("Error getRandomBooks:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// Tạo BookDetail kèm upload ảnh
exports.createBookDetail = async (req, res) => {
  try {
    const {
      edition,
      pages,
      language,
      stock_quantity,
      dimensions,
      weight,
      publication_year,
      cover_type,
      volume,
      book_name, // <-- Nhận tên sách thay vì id
      price,
      isbn
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!book_name || !price || !isbn) {
      return res.status(400).json({ message: 'book_name, price và isbn là bắt buộc' });
    }

    // Tìm book theo tên
    const book = await Book.findOne({ name: book_name });
    if (!book) {
      return res.status(404).json({ message: `Không tìm thấy sách tên "${book_name}"` });
    }

    // Kiểm tra ISBN trùng
    const existingISBN = await BookDetail.findOne({ isbn });
    if (existingISBN) {
      return res.status(400).json({ message: 'ISBN đã tồn tại' });
    }

    // Xử lý ảnh upload (nếu có)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // Tạo BookDetail mới
    const newBookDetail = new BookDetail({
      edition,
      pages,
      language,
      stock_quantity,
      dimensions,
      weight,
      publication_year,
      cover_type,
      volume,
      book_id: book._id, // <-- Lấy id từ tên sách
      images,
      price,
      isbn
    });

    const savedBookDetail = await newBookDetail.save();

    res.status(201).json({
      message: 'BookDetail created successfully',
      bookDetail: savedBookDetail
    });
  } catch (error) {
    console.error('Create BookDetail error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
// Lấy 10 SACH MOI NHAY
exports.getLatestBooks = async (req, res) => {
  try {
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    const latestBookDetails = await BookDetail.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: 'book_id', select: 'name slug' });

    const booksWithDiscount = latestBookDetails
      .filter(detail => detail.book_id) // loại bỏ các detail có book_id null
      .map(detail => {
        const book = {
          _id: detail.book_id._id,
          name: detail.book_id.name,
          slug: detail.book_id.slug,
          description: detail.description,
          images: detail.images,
          price: detail.price,
          volume: detail.volume,
          createdAt: detail.createdAt
        };
        return applyBookDiscount(book, discount);
      });


    res.status(200).json(booksWithDiscount);
  } catch (error) {
    console.error('Lỗi khi lấy sách mới nhất:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//LAY CHI TIET SACH
exports.getBookDetail = async (req, res) => {
  try {
    const { id, slug } = req.params;

    // 1️⃣ Lấy thông tin sách kèm category, author, publisher
    const book = await Book.findOne({ _id: id, slug })
      .populate('category_id', 'name slug')
      .populate('author_id', 'name bio')
      .populate('publisher_id', 'name slug');

    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }

    // 2️⃣ Lấy tất cả details
    const bookDetails = await BookDetail.find({ book_id: book._id });

    if (!bookDetails || bookDetails.length === 0) {
      return res.status(404).json({ message: 'Không có chi tiết sách' });
    }

    // 3️⃣ Lấy discount đang active
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    // 4️⃣ Áp dụng discount cho từng detail
    const detailsWithDiscount = bookDetails.map(detail => applyBookDiscount(detail.toObject(), discount));

    // 5️⃣ Trả về JSON
    res.status(200).json({
      ...book.toObject(),
      details: detailsWithDiscount,
      activeDiscount: discount || null
    });

  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết sách:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
//LAY 10 SACH THEO DANH MUC
exports.getBooksByCategory = async (req, res) => {
  try {
    const { id, slug } = req.params;

    // 1️⃣ Kiểm tra danh mục
    const category = await Category.findOne({ _id: id, slug });
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // 2️⃣ Lấy discount đang active (áp dụng toàn bộ sách)
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // 3️⃣ Lấy sách theo category + join bookdetails + random 10
    const books = await Book.aggregate([
      { $match: { category_id: category._id } },
      {
        $lookup: {
          from: "bookdetails",
          localField: "_id",
          foreignField: "book_id",
          as: "details",
        },
      },
      { $unwind: "$details" },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          images: "$details.images",
          price: "$details.price",
          volume: "$details.volume",
        },
      },
      { $sample: { size: 10 } }, // random 10 quyển sách
    ]);

    // 4️⃣ Áp dụng discount nếu có
    const booksWithDiscount = books.map((book) => applyBookDiscount(book, discount));

    // 5️⃣ Trả về JSON
    res.status(200).json(booksWithDiscount);
  } catch (error) {
    console.error("❌ Error getBooksByCategory:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};