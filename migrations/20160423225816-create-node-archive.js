'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable('nodes_archive', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      node_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      x_coordinate: {
        type: Sequelize.DOUBLE,
        defaultValue: null
      },
      y_coordinate: {
        type: Sequelize.DOUBLE,
        defaultValue: null
      },
      last_transmission: {
        allowNull: false,
        type: Sequelize.STRING
      },
      packets_sent: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      packets_received: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      date_created_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
    }).then(function() {
      // return a promise from the queryInterface methods
      return queryInterface.addIndex('nodes_archive', ['node_id', 'date_created_id']);
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('nodes_archive');
  }
};
