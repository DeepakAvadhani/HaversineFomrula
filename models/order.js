const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      address_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "address",
          key: "id",
        },
      },
      shop_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "shop_details",
          key: "id",
        },
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending",
      },
      reference_number: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("shop","medicine"),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "order",
      timestamps: false,
    }
  );
};
