module.exports = (sequelize, DataTypes) => {
    const DeviceToken = sequelize.define(
      "DeviceToken",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        agent_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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
  