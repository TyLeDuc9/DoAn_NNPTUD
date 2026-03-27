const express = require("express");
const router = express.Router();
const discountController = require("../controller/bookDiscountController")
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get("/", discountController.getAllDiscounts);
router.post("/", verifyToken, verifyRole(['admin']), discountController.createDiscount);
router.get("/:id", discountController.getDiscountById);
router.get("/active", discountController.getActiveDiscount); 
router.put("/:id", verifyToken, verifyRole(['admin']), discountController.updateDiscount);
router.delete("/:id", verifyToken, verifyRole(['admin']), discountController.deleteDiscount);

module.exports = router;
