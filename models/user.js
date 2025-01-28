const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        set(value) {
          this.setDataValue("email", value === "" ? null : value);
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        set(value) {
          this.setDataValue("name", value === "" ? null : value);
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        set(value) {
          this.setDataValue("password", value === "" ? null : value);
        },
      },
      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "customer",
        set(value) {
          this.setDataValue("role", value === "" ? "customer" : value);
        },
      },
      pincode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        set(value) {
          this.setDataValue("pincode", value === "" ? null : value);
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'inactive']],
        },
      },      
      
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: false,
    }
  );
};
