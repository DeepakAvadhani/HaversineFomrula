const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ZoneCoordinates extends Model {}

  ZoneCoordinates.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      zone_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ZoneCoordinates',
      tableName: 'zone_coordinates',
      timestamps: false,
    }
  );

  return ZoneCoordinates;
};
