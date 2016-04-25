'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    
    queryInterface.createTable('Edge_archives', {
      edge_id: {
        allowNull: false,
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
    
    // return a promise from the queryInterface methods
    return queryInterface.addIndex('Edge_archives', ['createdAt']);
    
    // return query;
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Edge_archives');
  }
};
