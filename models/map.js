const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "map",
    {
      gid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      zone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      geom: {
        type: DataTypes.GEOMETRY("MULTIPOLYGON", 32643), // Geometry type with SRID 4326 (WGS 84)
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "map",
      timestamps: false,
    }
  );
};
