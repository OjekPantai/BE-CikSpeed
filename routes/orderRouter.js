const express = require("express");
const router = express.Router();
const {
  createOrder,
  getCurrentOrders,
  getOrderDetails,
  updateOrderStatus,
  deleteOrder,
  readOrders,
} = require("../controllers/orderController");
const {
  authMiddleware,
  permissionUser,
} = require("../middlewares/userMiddleware");

router.get("/", readOrders); // This endpoint can do search, limit, and pagination example : /api/orders?search=username&limit=10&page=1
router.get("/current", authMiddleware, getCurrentOrders); // Get Order data by current user logged in
router.get("/:id", authMiddleware, getOrderDetails);
router.post("/", authMiddleware, permissionUser("admin", "user"), createOrder);
router.put("/:id", authMiddleware, permissionUser("admin"), updateOrderStatus); // Update status only
router.delete("/:id", authMiddleware, permissionUser("admin"), deleteOrder);

module.exports = router;
