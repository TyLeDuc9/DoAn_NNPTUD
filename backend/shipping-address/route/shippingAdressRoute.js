const express = require("express");
const router = express.Router();
const shippingAddressController = require("../controller/shippingAddressController");
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get("/grouped", verifyToken, verifyRole(['admin', 'employee']), shippingAddressController.getAddressesGroupedByUser);

router.get("/:userId", shippingAddressController.getAllAddresses);
router.get("/by/:id", shippingAddressController.getAddressById);
// Thêm địa chỉ mới
router.post("/", shippingAddressController.createAddress);

// Cập nhật địa chỉ
router.put("/:id", shippingAddressController.updateAddress);
router.put("/:id", shippingAddressController.adminUpdateAddress);

// Xóa địa chỉ
router.delete("/:id", shippingAddressController.deleteAddress);

// Đặt địa chỉ mặc định
router.patch("/set-default", shippingAddressController.setDefaultAddress);

module.exports = router;
