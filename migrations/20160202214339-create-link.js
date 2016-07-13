'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('links_present', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      source_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      target_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      traffic_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      floor_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    return queryInterface.addIndex('links_present', ['source_id', 'target_id']);
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('links_present');
  }
};
