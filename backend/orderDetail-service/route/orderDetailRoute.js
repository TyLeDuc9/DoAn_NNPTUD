const express = require("express");
const router = express.Router();
const orderDetailController = require("../controller/orderDetailController");
router.get("/:orderId",orderDetailController.getOrderDetailsByOrder); 
router.get("/:detailId", orderDetailController.getOrderDetailById); 
router.delete("/:detailId",orderDetailController.deleteOrderDetail);

module.exports = router;
