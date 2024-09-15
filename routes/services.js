const express = require("express");
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const {
  authMiddleware,
  permissionUser,
} = require("../middlewares/userMiddleware");

const router = express.Router();

router.get("/", getAllServices); // Guest, user, and admin can access this endpoint
router.get("/:id", getServiceById); // Guest, user, and admin can access this endpoint
router.post("/", authMiddleware, permissionUser("admin"), createService); // Only admin can access this endpoint
router.put("/:id", authMiddleware, permissionUser("admin"), updateService); // Only admin can access this endpoint
router.delete("/:id", authMiddleware, permissionUser("admin"), deleteService); // Only admin can access this endpoint

module.exports = router;
