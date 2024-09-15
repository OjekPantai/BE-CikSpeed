const { User } = require("../models");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create a JWT (JSON Web Token) token, set a cookie to store the token, and send a JSON response to the client containing the status, token, and user data.

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Convert value of JWT_COOKIE_EXPIRES_IN to milisecond
    ),
    httpOnly: true,
  };

  // Set a cookie to store the token.
  res.cookie("jwt", token, cookieOptions);

  // Remove password from response data
  user.password = undefined;

  // Send a JSON response to the client containing the status, token, and user data.
  res.status(statusCode).json({
    status: "Success",
    data: {
      user,
    },
  });
};

exports.registerUser = async (req, res) => {
  try {
    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).json({
        message: "Validation Error",
        error: ["Password doesn't match"],
      });
    }

    const newUser = await User.create({
      username: req.body.username,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    });

    // If all is correct, Generate token response then send response and store token to client.
    createSendToken(newUser, 201, res);
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: "Error validation",
      error: error.errors.map((err) => err.message),
    });
  }
};

exports.loginUser = async (req, res) => {
  // Validation function if username or password is null
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: "Failed",
      message: "Validation Error",
      error: "Username and Password is required",
    });
  }

  // Validation function if username and password is correct
  const userData = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (
    !userData ||
    !(await userData.CorrectPassword(req.body.password, userData.password))
  ) {
    return res.status(400).json({
      status: "Failed",
      message: "Login Error",
      error: "Username or Password is wrong",
    });
  }

  // If username and password is correct, Generate token response then send response and store token to client.
  createSendToken(userData, 200, res);
};

exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Success logout",
  });
};

exports.getCurrentUser = async (req, res) => {
  const currentUser = await User.findByPk(req.user.id);

  if (currentUser) {
    return res.status(200).json({
      id: currentUser.id,
      username: currentUser.username,
      address: currentUser.address,
      phoneNumber: currentUser.phoneNumber,
      role_id: currentUser.role_id,
    });
  }

  return res.status(404).json({
    message: "User not found",
  });
};
