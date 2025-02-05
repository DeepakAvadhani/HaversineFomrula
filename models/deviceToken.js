module.exports = (sequelize, DataTypes) => {
    const DeviceToken = sequelize.define(
      "DeviceToken",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        tableName: "DeviceTokens",
        timestamps: true,
      }
    );
  
    return DeviceToken;
  };
  