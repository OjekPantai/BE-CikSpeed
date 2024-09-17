const express = require("express");
const {
  readServices,
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

router.get("/", readServices); // This endpoint can do search, limit, and pagination example : /api/services?search=serviceName&limit=10&page=1
router.get("/:id", getServiceById); // Guest, user, and admin can access this endpoint
// router.post("/", authMiddleware, permissionUser("admin"), createService); // Only admin can access this endpoint
router.post("/", createService); // JUST FOR TESTING IN FRONT END
router.put("/:id", authMiddleware, permissionUser("admin"), updateService); // Only admin can access this endpoint
router.delete("/:id", authMiddleware, permissionUser("admin"), deleteService); // Only admin can access this endpoint

module.exports = router;
