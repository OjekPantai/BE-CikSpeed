const { Order, Service, User, OrderService } = require("../models");
const { sequelize } = require("../models");

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { complaint_message, service_ids } = req.body;
    const user_id = req.user.id;

    // Validate user
    const user = await User.findByPk(user_id);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Validate and get services
    const services = await Service.findAll({
      where: {
        id: service_ids,
      },
    });

    if (services.length !== service_ids.length) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid service IDs" });
    }

    // Calculate total cost and estimate
    const total_cost = services.reduce((sum, service) => sum + service.cost, 0);
    const total_estimate = services.reduce(
      (sum, service) => sum + service.estimate,
      0
    );

    // Create order
    const order = await Order.create(
      {
        user_id,
        complaint_message,
        status: "Menunggu konfirmasi",
        total_cost,
        total_estimate,
      },
      { transaction: t }
    );

    // Create OrderService associations
    await OrderService.bulkCreate(
      services.map((service) => ({
        order_id: order.id,
        service_id: service.id,
      })),
      { transaction: t }
    );

    await t.commit();

    // Fetch the created order with associated services
    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: Service }],
    });

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: Service },
        { model: User, attributes: ["id", "username"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [
        { model: Service },
        { model: User, attributes: ["id", "username"] },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { status } = req.body;

    if (!status) {
      await t.rollback();
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status }, { transaction: t });

    await t.commit();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    await order.destroy({ transaction: t });

    await t.commit();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
