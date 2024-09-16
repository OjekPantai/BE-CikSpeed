const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const {
  authMiddleware,
  permissionUser,
} = require("../middlewares/userMiddleware");

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.post("/", authMiddleware, permissionUser("admin", "user"), createOrder);
router.put("/:id", authMiddleware, permissionUser("admin"), updateOrderStatus); // Update status only
router.delete("/:id", authMiddleware, permissionUser("admin"), deleteOrder);

module.exports = router;
