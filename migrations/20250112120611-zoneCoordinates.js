"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("shop_zone", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      zone_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "map",
          key: "gid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      shop_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("shop_zone");
  },
};
