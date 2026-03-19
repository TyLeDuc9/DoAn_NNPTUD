const moment = require("moment");
const mongoose = require("mongoose");
const qs = require("qs");
const crypto = require("crypto");
const config = require("../config/vnpay");
const Order = mongoose.model('Order', require('../../order-service/model/Order').schema);
// Tạo payment VNPay
exports.createVNPayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Lấy order từ DB
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // IP address chuẩn IPv4
    const ipAddr =
      (req.headers["x-forwarded-for"] && req.headers["x-forwarded-for"].split(",")[0]) ||
      req.socket.remoteAddress?.replace("::ffff:", "") ||
      "127.0.0.1";

    const orderIdVNPay = moment().format("YYYYMMDDHHmmss");

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_Amount: order.totalAmount * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderIdVNPay,
      vnp_OrderInfo: `Thanh_toan_don_hang_${orderId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: config.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_Locale: "vn",
      vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
    };

    // Sắp xếp params theo key
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // URL redirect sang VNPay
    const paymentUrl = config.vnp_Url + "?" + qs.stringify(vnp_Params, { encode: true });

    return res.json({ paymentUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Lỗi tạo thanh toán VNPay" });
  }
};

// Xử lý callback từ VNPay
exports.handleVNPayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // ---- LOG DEBUG ----
    console.log("Received vnp_Params:", vnp_Params);
    console.log("Received SecureHash:", secureHash);
    console.log("Calculated SecureHash:", signed);

    const orderId = vnp_Params["vnp_OrderInfo"].replace("Thanh_toan_don_hang_", "");
    const paymentStatus = vnp_Params["vnp_ResponseCode"] === "00" ? "paid" : "failed";

    if (secureHash === signed) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: paymentStatus,
        transactionId: vnp_Params["vnp_TransactionNo"],
        status: paymentStatus === "paid" ? "confirmed" : "pending",
      });

      return res.redirect(`http://localhost:5173/payment-result?status=${paymentStatus}`);
    } else {
      return res.redirect("http://localhost:5173/payment-result?status=failed");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi xử lý VNPay" });
  }
};

// Helper sắp xếp object theo key
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => (sorted[key] = obj[key]));
  return sorted;
}