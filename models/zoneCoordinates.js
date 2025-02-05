const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "shop_zone",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      zone_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "map",
          key: "gid",
        },
      },
      shop_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "shop_zone",
      timestamps: false,
    }
  );
};
