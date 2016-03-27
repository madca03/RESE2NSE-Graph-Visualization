'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Edges', {
      edge_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      target: {
        type: Sequelize.STRING
      },
      traffic: {
        type: Sequelize.STRING
      },
      floor_number: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Edges');
  }
};
