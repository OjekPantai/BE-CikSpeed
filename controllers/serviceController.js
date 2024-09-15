const { Service } = require("../models");
const asyncHandle = require("../middlewares/asyncHandle");

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    return res.status(200).json({
      status: "Success",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "An error occurred while fetching services",
      error: error.message,
    });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    let { id } = req.params;
    const service = await Service.findOne({ where: { id } });

    if (!service) {
      return res.status(404).json({
        status: "Failed",
        message: `Service with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      status: "Success",
      data: service,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Failed",
      message: "Service not found",
      error: error.message,
    });
  }
};

exports.createService = asyncHandle(async (req, res) => {
  let { name, description, cost, estimate } = req.body;

  const newService = await Service.create({
    name,
    description,
    cost,
    estimate,
  });

  return res.status(201).json({
    status: "Success",
    data: newService,
  });
});

exports.updateService = asyncHandle(async (req, res) => {
  const id = req.params.id;
  await Service.update(req.body, {
    where: {
      id,
    },
  });

  const newService = await Service.findByPk(id);

  if (!newService) {
    res.status(404);
    throw new Error(`Service isn't found`);
  }

  return res.status(201).json({
    status: "Success",
    message: "Service updated successfully",
    data: newService,
  });
});

exports.deleteService = async (req, res) => {
  try {
    let { id } = req.params;

    const service = await Service.findOne({ where: { id } });
    if (!service) {
      return res.status(404).json({
        status: "Failed",
        message: `Service with ID ${id} not found`,
      });
    }

    await Service.destroy({ where: { id } });

    return res.status(200).json({
      status: "Success",
      message: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "An error occurred while deleting the service",
      error: error.message,
    });
  }
};
