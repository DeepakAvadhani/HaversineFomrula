'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zone_coordinates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      zone_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      zone_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      coordinates: {
        type: Sequelize.GEOMETRY('POINT', 32643), // Updated SRID to 32643
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('zone_coordinates');
  },
};
