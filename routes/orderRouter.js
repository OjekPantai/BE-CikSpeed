const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const {
  authMiddleware,
  permissionUser,
} = require("../middlewares/userMiddleware");

// router.get("/", authMiddleware, getOrders);
// router.get(
//   "/:id",
//   authMiddleware,
//   permissionUser("admin", "user"),
//   getDetailOrders
// );
router.post("/", authMiddleware, permissionUser("admin", "user"), createOrder);
// router.put("/:id", authMiddleware, permissionUser("admin"), updateStatus); // Update status only
// router.delete("/:id", authMiddleware, permissionUser("admin"), deleteOrders);

module.exports = router;
