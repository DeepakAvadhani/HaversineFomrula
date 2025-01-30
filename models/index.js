const sequelize = require("../config/sequelize");
const DataTypes = require("sequelize").DataTypes;

const _user = require("./user");
const _zone_coordinates = require("./zoneCoordinates");
const _devicetoken = require("./deviceToken");

const User = _user(sequelize, DataTypes);
const ZoneCoordinates = _zone_coordinates(sequelize, DataTypes);
const devicetoken = _devicetoken(sequelize, DataTypes);

User.hasMany(devicetoken, { as: "deviceTokens", foreignKey: "user_id" });
devicetoken.belongsTo(User, { as: "user", foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  ZoneCoordinates,
  devicetoken,
};
