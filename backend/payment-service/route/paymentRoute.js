const express = require('express');
const router = express.Router();
const paymentCtrl = require("../controller/paymentController");

router.post("/create-vnpay", paymentCtrl.createVNPayPayment);
router.get("/vnpay-return", paymentCtrl.handleVNPayReturn);

module.exports = router;
