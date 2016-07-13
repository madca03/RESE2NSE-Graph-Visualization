'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('links_archive', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      link_id: {
        allowNull: false,
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
      date_created_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    }).then(function() {
      // return a promise from the queryInterface methods
      return queryInterface.addIndex('links_archive', ['date_created_id']);
    });

    // return query;
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('links_archive');
  }
};
