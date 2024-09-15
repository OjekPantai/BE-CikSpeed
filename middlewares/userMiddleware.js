const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

exports.authMiddleware = async (req, res, next) => {
  // Check is token already exist in header
  let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1]; //Split "bearer" with Token
  // }

  token = req.cookies.jwt; //Get JWT Token from cookies

  // Check is user already login
  if (!token) {
    return next(
      res.status(401).json({
        status: 401,
        message: `Access denied. Please log in to continue`,
      })
    );
  }
  // Decode & Verify JWT_Token
  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      res.status(401).json({
        error: err,
        message: "Invalid token",
      })
    );
  }

  // Get the data of the currently logged in user.
  const currentUser = await User.findByPk(decoded.id);

  // If user is not found in DB token can't be verified
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: 401,
        message: `Access denied. Please log in to continue`,
      })
    );
  }

  req.user = currentUser;

  next();
};

exports.permissionUser = (...roles) => {
  return async (req, res, next) => {
    // Looks up the role based on the role_id associated with the user making the request (req.user)
    const rolesData = await Role.findByPk(req.user.role_id);

    const roleName = rolesData.name;

    if (!roles.includes(roleName)) {
      return next(
        res.status(403).json({
          status: 403,
          error: "You're not authorized",
        })
      );
    }

    next();
  };
};
