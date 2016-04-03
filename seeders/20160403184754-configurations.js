'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Configurations', null, {});

    var configuration = [{
      base_browser_width: 1366,
      base_graph_container_width: 866,
      createdAt: new Date(),
      updatedAt: new Date()
    }];

    return queryInterface.bulkInsert('Configurations', configuration);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Configurations', null, {});
  }
};
