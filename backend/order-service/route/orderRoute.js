const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
router.get("/revenue", verifyToken, verifyRole(["admin"]), orderController.revenue);
router.get("/", verifyToken, verifyRole(["admin", "user", "employee"]), orderController.getOrdersByStatus);
router.put(
  "/status/:orderId",
  verifyToken,
  verifyRole(["admin", "user", "employee"]),
  orderController.updateOrderStatus
);

router.get("/all", verifyToken, verifyRole(["admin", "user"]), orderController.getAllOrders);
router.post("/", orderController.createOrderFromCart);
router.post("/buy-now", orderController.createOrderBuyNow);
router.get("/orders/:orderId", verifyToken, verifyRole(["admin", "user", "employee"]), orderController.getOrderById);


router.get("/:userId", orderController.getOrdersByUser);

module.exports = router;
