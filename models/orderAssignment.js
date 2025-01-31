module.exports = (sequelize, DataTypes) => {
    const OrderAssignment = sequelize.define(
      "OrderAssignment",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        order_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "order",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        agent_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        status: {
          type: DataTypes.ENUM("pending", "accepted", "rejected"),
          allowNull: false,
          defaultValue: "pending",
        },
      },
      {
        tableName: "OrderAssignments",
        timestamps: true,
      }
    );
  
    return OrderAssignment;
  };
  