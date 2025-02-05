const sequelize = require("../config/sequelize");
const DataTypes = require("sequelize").DataTypes;

const _user = require("./user");
const _zone_coordinates = require("./zoneCoordinates");
const _devicetoken = require("./deviceToken");
const _order = require("./order");
const  _order_assignment = require("./orderAssignment");
const User = _user(sequelize, DataTypes);
const _map = require("./map");

const ZoneCoordinates = _zone_coordinates(sequelize, DataTypes);
const devicetoken = _devicetoken(sequelize, DataTypes);
const orderAssignment = _order_assignment(sequelize, DataTypes);
const Order = _order(sequelize, DataTypes);
const Map = _map(sequelize, DataTypes);

ZoneCoordinates.belongsTo(Map, { as: "zone", foreignKey: "zone_id", onDelete: "CASCADE" });
Map.hasMany(ZoneCoordinates, { as: "shopZones", foreignKey: "zone_id" });

User.hasMany(devicetoken, { as: "deviceTokens", foreignKey: "user_id" });
devicetoken.belongsTo(User, { as: "user", foreignKey: "user_id" });

orderAssignment.belongsTo(Order, { as: "order", foreignKey: "order_id", onDelete: "CASCADE" });
Order.hasMany(orderAssignment, { as: "assignments", foreignKey: "order_id" });

orderAssignment.belongsTo(User, { as: "agent", foreignKey: "agent_id", onDelete: "CASCADE" });
User.hasMany(orderAssignment, { as: "assignments", foreignKey: "agent_id" });


module.exports = {
  sequelize,
  User,
  ZoneCoordinates,
  devicetoken,
  Order,
  orderAssignment
};
