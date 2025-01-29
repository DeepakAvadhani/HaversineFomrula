const sequelize = require("../config/sequelize");
const DataTypes = require("sequelize").DataTypes;

const _user = require("./user");
const _zone_coordinates = require("./zoneCoordinates");

const User = _user(sequelize, DataTypes);
const ZoneCoordinates = _zone_coordinates(sequelize, DataTypes);

module.exports = {
  sequelize,
  User,
  ZoneCoordinates,
};
