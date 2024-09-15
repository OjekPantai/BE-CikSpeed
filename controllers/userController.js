const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, address, phoneNumber, role, password } = req.body;

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      address,
      phoneNumber,
      role,
      password: hashPassword,
    });
    return res.status(201).json({
      status: "Success",
      data: newUser,
      message: "User created successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: "Failed to create user.",
      errors: error.errors
        ? error.errors.map((err) => err.message)
        : [error.message],
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: `User with ID ${id} not found.`,
      });
    }
    return res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Failed",
      message: "User not found",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, address, phoneNumber, role, password } = req.body;
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: `User with ID ${id} not found.`,
      });
    }

    await User.update(
      {
        name,
        address,
        phoneNumber,
        role,
        password,
      },
      {
        where: { id },
      }
    );

    return res.status(201).json({
      status: "Success",
      message: "User updated successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: "An error occurred while updating the user.",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: `User with ID ${id} not found.`,
      });
    }

    await User.destroy({ where: { id } });

    return res.status(200).json({
      status: "Success",
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: "An error occurred while deleting the user.",
      error: error.message,
    });
  }
};
