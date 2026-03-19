const mongoose = require("mongoose");
const orderDetailSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    bookdetail_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookDetail",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    subtotal: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
