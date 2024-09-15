const asyncHandler = require("../middlewares/asyncHandle");
const { Order, Service } = require("../models");

exports.createOrders = asyncHandler(async (req, res) => {
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
    status: "Menunggu Konfirmasi",
    total_cost,
    total_estimate,
  });

  res.status(201).json({
    status: "Success",
    data: newOrder,
  });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll();

  return res.status(200).json({
    data: orders,
  });
});

exports.getDetailOrders = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const orderData = await Order.findByPk(id);

  if (!orderData) {
    res.status(404);
    throw new Error("Order data not found");
  }

  return res.status(200).json({
    data: orderData,
  });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Status is required to update.");
  }

  await Order.update(
    { status },
    {
      where: {
        id,
      },
    }
  );

  const updatedOrder = await Order.findByPk(id);

  if (!updatedOrder) {
    res.status(404);
    throw new Error(`Order data not found`);
  }

  return res.status(200).json({
    status: "Success",
    message: "Order status updated successfully",
    data: updatedOrder,
  });
});

exports.deleteOrders = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await Order.destroy({
    where: {
      id,
    },
  });

  return res.status(200).json({
    status: "Success",
    message: "Order data deleted successfully",
  });
});
