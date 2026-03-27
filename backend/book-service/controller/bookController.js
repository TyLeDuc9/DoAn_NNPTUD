const mongoose = require('mongoose');
const Category = mongoose.model('Category', require('../../category-service/model/Category').schema);
const Author = mongoose.model('Author', require('../../author-service/model/Author').schema);
const Publisher = mongoose.model('Publisher', require('../../publisher-service/model/Publisher').schema);
const BookDiscount = mongoose.model('BookDiscount', require('../../bookDiscount-service/model/BookDiscount').schema);
const Book = require('../model/Book');
const slugify = require('slugify');
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, category_name, author_name, publisher_name } = req.body;

    // Tìm sách cần cập nhật
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách để cập nhật" });
    }

    // Nếu có tên mới → tạo slug mới
    if (name) {
      const slug = slugify(name, { lower: true, strict: true });

      // Kiểm tra trùng tên (slug)
      const existingBook = await Book.findOne({ slug, _id: { $ne: id } });
      if (existingBook) {
        return res.status(400).json({ message: "Tên sách đã tồn tại" });
      }

      book.name = name;
      book.slug = slug;
    }

    if (description) book.description = description;

    // Xử lý danh mục (category)
    if (category_name) {
      if (!Array.isArray(category_name)) category_name = [category_name];
      const categories = await Category.find({ name: { $in: category_name } });
      if (!categories.length) {
        return res.status(404).json({ message: "Không tìm thấy danh mục hợp lệ" });
      }
      book.category_id = categories.map(c => c._id);
    }

    // Xử lý tác giả (author)
    if (author_name) {
      if (!Array.isArray(author_name)) author_name = [author_name];
      const authors = await Author.find({ name: { $in: author_name } });
      if (!authors.length) {
        return res.status(404).json({ message: "Không tìm thấy tác giả hợp lệ" });
      }
      book.author_id = authors.map(a => a._id);
    }

    // Xử lý nhà xuất bản (publisher)
    if (publisher_name) {
      const publisher = await Publisher.findOne({ name: publisher_name });
      if (!publisher) {
        return res.status(404).json({ message: `Publisher "${publisher_name}" không tồn tại` });
      }
      book.publisher_id = publisher._id;
    }

    // Lưu thay đổi
    const updatedBook = await book.save();

    // Populate để trả về đầy đủ thông tin liên kết
    const populatedBook = await Book.findById(updatedBook._id)
      .populate("category_id", "name")
      .populate("author_id", "name")
      .populate("publisher_id", "name");

    res.status(200).json({
      message: "Cập nhật sách thành công",
      book: populatedBook,
    });

  } catch (error) {
    console.error("❌ Lỗi khi cập nhật sách:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật sách", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm xem sách có tồn tại không
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách để xoá" });
        }

        await Book.findByIdAndDelete(id);

        res.status(200).json({
            message: "Xoá sách thành công",
            deletedBook: book,
        });
    } catch (error) {
        console.error("❌ Lỗi khi xoá sách:", error);
        res.status(500).json({ message: "Lỗi server khi xoá sách", error: error.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sort = req.query.sort || "newest";

        // Filter search theo tên sách
        const searchFilter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        // Sắp xếp theo ngày tạo
        const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const total = await Book.countDocuments(searchFilter);

        const books = await Book.find(searchFilter)
            .populate("category_id", "name")
            .populate("author_id", "name")
            .populate("publisher_id", "name")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            books
        });

    } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            search, 
            category_id, 
            publisher_id, 
            author_id,
            sort = "createdAt", 
            order = "desc"
        } = req.query;

        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" }; // tìm theo tên sách
        }

        if (category_id) {
            filter.category_id = category_id;
        }

        if (publisher_id) {
            filter.publisher_id = publisher_id;
        }

        if (author_id) {
            filter.author_id = author_id;
        }

        const total = await Book.countDocuments(filter);

        const books = await Book.find(filter)
            .populate("category_id", "name")
            .populate("author_id", "name")
            .populate("publisher_id", "name")
            .sort({ [sort]: order === "desc" ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            books,
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sách:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
exports.createBook = async (req, res) => {
  try {
    let { name, description, category_name, author_name, publisher_name } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !category_name || !author_name || !publisher_name) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    // Nếu chỉ có 1 category gửi dạng string thì chuyển thành mảng
    if (!Array.isArray(category_name)) {
      category_name = [category_name];
    }

    // Nếu chỉ có 1 author gửi dạng string thì chuyển thành mảng
    if (!Array.isArray(author_name)) {
      author_name = [author_name];
    }

    // Tạo slug
    const slug = slugify(name, { lower: true, strict: true });
    const existingBook = await Book.findOne({ slug });
    if (existingBook) {
      return res.status(400).json({ message: "Tên sách đã tồn tại" });
    }

    // Tìm category theo mảng tên
    const categories = await Category.find({ name: { $in: category_name } });
    if (!categories.length) {
      return res.status(404).json({ message: "Không tìm thấy danh mục hợp lệ" });
    }
    const categoryIds = categories.map(c => c._id);

    // Tìm tác giả theo danh sách tên
    const authors = await Author.find({ name: { $in: author_name } });
    if (!authors.length) {
      return res.status(404).json({ message: "Không tìm thấy tác giả hợp lệ" });
    }
    const authorIds = authors.map(a => a._id);

    // Tìm publisher
    const publisher = await Publisher.findOne({ name: publisher_name });
    if (!publisher) {
      return res.status(404).json({ message: `Publisher "${publisher_name}" không tồn tại` });
    }

    // Tạo sách mới
    const newBook = new Book({
      name,
      description,
      category_id: categoryIds,
      author_id: authorIds,
      publisher_id: publisher._id,
      slug
    });

    await newBook.save();

    res.status(201).json({
      message: "Tạo sách thành công",
      book: newBook
    });

  } catch (error) {
    console.error("Lỗi tạo sách:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


exports.getBookByIdAndSlug = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id)
            .populate('category_id', 'name')
            .populate('author_id', 'name')
            .populate('publisher_id', 'name');

        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        res.json(book);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id)
            .populate('category_id', 'name')
            .populate('author_id', 'name')
            .populate('publisher_id', 'name');

        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }

        res.json(book);
    } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
exports.getLatestBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ createdAt: -1 }) // sắp xếp giảm dần theo ngày tạo
            .limit(10); // lấy 10 cuốn mới nhất

        res.status(200).json({
            message: "Danh sách 10 sách mới nhất",
            books
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy 10 sách mới nhất:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
