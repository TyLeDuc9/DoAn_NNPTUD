const mongoose = require('mongoose');
const Cart = require("../model/Cart");
const BookDetail = mongoose.model('BookDetail', require('../../bookDetail-service/model/BookDetail').schema);
const Book = mongoose.model('Book', require('../../book-service/model/Book').schema);
const User = mongoose.model('User', require('../../user-service/model/User').schema);


const formatCart = (cart) => {
  const formattedItems = cart.items.map(item => ({
    id: item._id,
    bookdetailId: item.bookdetail_id?._id || null,
    bookId: item.bookdetail_id?.book_id?._id || null,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
    stock: item.bookdetail_id?.stock_quantity || 0,
    image: item.bookdetail_id?.images?.[0] || null,
    name: item.bookdetail_id?.book_id?.name || "Không rõ",
    slug: item.bookdetail_id?.book_id?.slug || null,
    volume: item.bookdetail_id?.volume || null,
    cover_type: item.bookdetail_id?.cover_type || null,
  }));

  return {
    _id: cart._id,
    user_id: cart.user_id,
    totalQuantity: formattedItems.reduce((s, i) => s + i.quantity, 0),
    totalPrice: formattedItems.reduce((s, i) => s + i.total, 0),
    items: formattedItems,
  };
};

exports.addToCart = async (req, res) => {
  try {

    const userId = req.user?.id;
    const { bookdetailId, quantity } = req.body;

    if (!userId)
      return res.status(401).json({ message: "Chưa đăng nhập" });

    if (!bookdetailId)
      return res.status(400).json({ message: "Thiếu bookdetailId" });

    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Số lượng phải > 0" });

    const bookDetail = await BookDetail.findById(bookdetailId);


    if (!bookDetail)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    let cart = await Cart.findOne({ user_id: userId, status: "active" });
    if (!cart) cart = new Cart({ user_id: userId, items: [] });

    const itemIndex = cart.items.findIndex(
      item => item.bookdetail_id.toString() === bookdetailId
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > bookDetail.stock_quantity)
        return res.status(400).json({
          message: `Tồn kho chỉ còn ${bookDetail.stock_quantity}`,
        });

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      if (quantity > bookDetail.stock_quantity)
        return res.status(400).json({
          message: `Tồn kho chỉ còn ${bookDetail.stock_quantity}`,
        });

      cart.items.push({
        bookdetail_id: bookdetailId,
        quantity,
        price: bookDetail.price,
      });
    }

    await cart.save();

    const savedCart = await cart.populate({
      path: "items.bookdetail_id",
      select: "images stock_quantity volume cover_type book_id price",
      populate: {
        path: "book_id",
        select: "_id name slug",
      },
    });

    res.status(200).json({
      message: "Đã thêm vào giỏ",
      cart: savedCart,
    });
  } catch (error) {
    console.error("❌ addToCart error:", error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
exports.deleteCartById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem giỏ hàng có tồn tại không
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Xóa giỏ hàng
    await Cart.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // sort=newest | oldest
    const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // 🟢 Tổng số carts
    const total = await Cart.countDocuments();

    // 🟢 Lấy carts (phân trang + sort)
    const carts = await Cart.find()
      .populate("user_id", "name email")
      .populate({
        path: "items.bookdetail_id",
        populate: { path: "book_id", model: "Book" }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: carts
    });
  } catch (error) {
    console.error("❌ Error fetching carts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user_id: userId, status: "active" }).populate({
      path: "items.bookdetail_id",
      select: "images stock_quantity volume cover_type book_id price",
      populate: { path: "book_id", select: "_id name slug" }
    });

    if (!cart || cart.items.length === 0)
      return res.status(200).json({ message: "Giỏ hàng trống", cart: null });

    res.status(200).json({ message: "Thành công", cart: formatCart(cart) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};



// 🛒 Cập nhật số lượng
exports.updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Số lượng phải > 0" });

    const cart = await Cart.findOne({ user_id: userId, status: "active" }).populate({
      path: "items.bookdetail_id",
      select: "price stock_quantity",
    });

    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

    if (quantity > (item.bookdetail_id?.stock_quantity || 0)) {
      return res.status(400).json({ message: `Tồn kho chỉ còn ${item.bookdetail_id?.stock_quantity || 0}` });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await cart.populate({
      path: "items.bookdetail_id",
      select: "images stock_quantity volume cover_type book_id price",
      populate: { path: "book_id", select: "_id name slug" },
    });

    res.status(200).json({ message: "Đã cập nhật giỏ hàng", cart: formatCart(updatedCart) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 🛒 Xóa sản phẩm
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    const cart = await Cart.findOne({ user_id: userId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const before = cart.items.length;
    cart.items = cart.items.filter(i => i._id.toString() !== itemId);

    if (cart.items.length === before)
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

    await cart.save();
    const updatedCart = await cart.populate({
      path: "items.bookdetail_id",
      select: "images stock_quantity volume cover_type book_id price",
      populate: { path: "book_id", select: "_id name slug" },
    });

    res.status(200).json({ message: "Đã xóa sản phẩm", cart: formatCart(updatedCart) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 🛒 Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user_id: userId, status: "active" });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng", cart: formatCart(cart) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
