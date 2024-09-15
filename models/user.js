"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "This username is already registered" },
        validate: {
          notNull: { msg: "Username is required" },
          notEmpty: { msg: "Username cannot be empty" },
          isAlphanumeric: {
            msg: "Username can only contain letters and numbers",
          },
          len: {
            args: [3, 50],
            msg: "Username must be between 3 and 50 characters",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address is required",
          },
          notEmpty: {
            msg: "Address cannot be empty",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "This phone number is already registered",
        },
        validate: {
          notNull: {
            msg: "Phone number is required",
          },
          notEmpty: {
            msg: "Phone number cannot be empty",
          },
          isNumeric: {
            msg: "Phone number must be a valid number",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password cannot be empty",
          },
          len: {
            args: [6, 100],
            msg: "Password must be at least 6 characters long",
          },
        },
      },
      role_id: {
        type: DataTypes.UUID,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10);
            user.password = await bcrypt.hash(user.password, salt);
          }

          if (!user.role_id) {
            const roleUser = await sequelize.models.Role.findOne({
              where: { name: "user" },
            });
            user.role_id = roleUser.id;
          }
        },
      },
      sequelize,
      modelName: "User",
    }
  );

  // Compare username and password from DB with req.body from user
  User.prototype.CorrectPassword = async (reqPassword, passwordDB) => {
    return await bcrypt.compareSync(reqPassword, passwordDB);
  };

  // Login Function With JWTWebToken

  return User;
};
