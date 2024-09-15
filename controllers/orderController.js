const asyncHandler = require("../middlewares/asyncHandle");
const { Order, Service } = require("../models");

exports.createOrder = asyncHandler(async (req, res) => {
  // Mendapatkan id user dari user yang sedang login
  const userId = req.user.id;
  const { selected_service_ids, complaint_message } = req.body; // Menggunakan selected_service_ids untuk layanan yang dipilih

  if (
    !Array.isArray(selected_service_ids) ||
    selected_service_ids.length === 0
  ) {
    return res.status(400).json({
      status: "Error",
      message: "At least one service is required",
    });
  }

  // Mengambil biaya dari setiap layanan dan menghitung total_cost
  const services = await Service.findAll({
    where: {
      id: selected_service_ids,
    },
  });

  if (services.length !== selected_service_ids.length) {
    return res.status(400).json({
      status: "Error",
      message: "One or more services not found",
    });
  }

  const total_cost = services.reduce(
    (total, service) => total + service.cost,
    0
  );

  // Total estimate dihitung otomatis tidak disimpan dalam database
  const total_estimate = services.reduce(
    (total, service) => total + service.estimate,
    0
  );

  // Membuat order baru
  const newOrder = await Order.create({
    user_id: userId,
    service_id: selected_service_ids.join(","), // Menggabungkan IDs layanan jika perlu disimpan sebagai string
    complaint_message,
    status: "Menunggu Konfirmasi", // Status diatur otomatis
    total_cost, // Total cost dihitung otomatis
  });

  res.status(201).json({
    status: "Success",
    data: newOrder,
    total_estimate,
  });
});
