'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Nodes', {
      node_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING
        // allowNull: false
      },
      x: {
        type: Sequelize.DOUBLE,
        // allowNull: false,
        defaultValue: null
      },
      y: {
        type: Sequelize.DOUBLE,
        // allowNull: false,
        defaultValue: null
      },
      coordinate_set: {
        type: Sequelize.BOOLEAN,
        // allowNull: false,
        defaultValue: false
      },
      sensor_type: {
        type: Sequelize.STRING
      },
      mac_address: {
        type: Sequelize.STRING
      },
      last_transmission: {
        type: Sequelize.STRING
      },
      packets_sent: {
        type: Sequelize.INTEGER
      },
      packets_received: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Nodes');
  }
};
