"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      phone_number: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      pincode: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "customer",
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      meta: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user");
  },
};
