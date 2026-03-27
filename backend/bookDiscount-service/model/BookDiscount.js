const mongoose = require("mongoose");

const bookDiscountSchema = new mongoose.Schema({
  title: { type: String, required: true }, // tên chương trình, ví dụ: "Sale 10% toàn bộ sách"
  description: { type: String },           // mô tả thêm (optional)
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],         // giảm % hoặc giảm số tiền
    required: true
  },
  value: { type: Number, required: true }, // % hoặc số tiền giảm
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true } // bật/tắt chương trình
}, { timestamps: true });

module.exports = mongoose.model("BookDiscount", bookDiscountSchema);
 