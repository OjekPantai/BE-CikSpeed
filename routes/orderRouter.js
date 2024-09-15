const express = require("express");
const router = express.Router();
const {
  createOrders,
  getOrders,
  getDetailOrders,
} = require("../controllers/orderController");
const { authMiddleware } = require("../middlewares/userMiddleware");

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getDetailOrders);
router.post("/", authMiddleware, createOrders);

module.exports = router;
