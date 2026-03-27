const BookDiscount = require("../model/BookDiscount");
// Lấy discount theo ID
exports.getDiscountById = async (req, res) => {
  try {
    const discount = await BookDiscount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.status(200).json(discount);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discount", error: err.message });
  }
};
// Cập nhật discount
exports.updateDiscount = async (req, res) => {
  try {
    const discount = await BookDiscount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ message: "Error updating discount", error: err.message });
  }
};
exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await BookDiscount.find().sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discounts", error: err.message });
  }
};
// Tạo discount mới
exports.createDiscount = async (req, res) => {
  try {
    const discount = new BookDiscount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ message: "Error creating discount", error: err.message });
  }
};


// Lấy discount đang active (áp dụng cho toàn bộ sách)
exports.getActiveDiscount = async (req, res) => {
  try {
    const now = new Date();
    const discount = await BookDiscount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    res.json(discount || null);
  } catch (err) {
    res.status(500).json({ message: "Error fetching active discount", error: err.message });
  }
};



// Xóa discount
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await BookDiscount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: "Discount not found" });
    res.json({ message: "Discount deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting discount", error: err.message });
  }
};
