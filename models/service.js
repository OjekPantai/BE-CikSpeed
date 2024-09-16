"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Service.belongsToMany(models.Order, {
        through: "OrderService",
        foreignKey: "service_id",
        otherKey: "order_id",
      });
    }
  }
  Service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "This service name must be unique",
        },
        validate: {
          notNull: {
            msg: "Service name is required",
          },
          notEmpty: {
            msg: "Service name cannot be empty",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Service cost is required",
          },
          isInt: {
            msg: "Service cost must be an integer",
          },
          min: {
            args: [0],
            msg: "Service cost must be a positive value",
          },
        },
      },

      estimate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Service estimate is required",
          },
          isInt: {
            msg: "Service estimate must be an number",
          },
          min: {
            args: [0],
            msg: "Service estimate must be a positive value",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Service",
      hooks: {
        afterValidate: (service) => {
          service.name = service.name.toLowerCase();
        },
      },
    }
  );
  return Service;
};
