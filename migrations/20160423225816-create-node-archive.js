'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Node_archives', {
      node_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING
      },
      x: {
        type: Sequelize.DOUBLE,
        defaultValue: null
      },
      y: {
        type: Sequelize.DOUBLE,
        defaultValue: null
      },
      coordinate_set: {
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('Node_archives');
  }
};
