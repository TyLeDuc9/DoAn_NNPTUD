const mongoose = require("mongoose");
const OrderDetail = require("../model/OrderDetail");
const BookDetail = mongoose.model('BookDetail', require('../../bookDetail-service/model/BookDetail').schema);
const Book = mongoose.model('Book', require('../../book-service/model/Book').schema);
const Order = mongoose.model('Order', require('../../order-service/model/Order').schema);
const ShippingAddress = mongoose.model('ShippingAddress', require('../../shipping-address/model/ShippingAddress').schema);
exports.getOrderDetailsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }


    const details = await OrderDetail.find({ order_id: orderId })
      .populate({
        path: "bookdetail_id",
        populate: {
          path: "book_id",
          select: "name"
        }
      });

  
    res.json({
      shippingFee: order.shippingFee,  
      totalAmount: order.totalAmount,   
      orderDetails: details
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: err.message });
  }
};
// -------------------- Lấy 1 chi tiết đơn hàng --------------------
exports.getOrderDetailById = async (req, res) => {
  try {
    const { detailId } = req.params;
    const detail = await OrderDetail.findById(detailId).populate("bookdetail_id");

    if (!detail) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
    }

    res.json(detail);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: err.message });
  }
};

// -------------------- Xóa chi tiết đơn hàng --------------------
exports.deleteOrderDetail = async (req, res) => {
  try {
    const { detailId } = req.params;
    await OrderDetail.findByIdAndDelete(detailId);

    res.json({ message: "Đã xóa chi tiết đơn hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa chi tiết đơn hàng", error: err.message });
  }
};
