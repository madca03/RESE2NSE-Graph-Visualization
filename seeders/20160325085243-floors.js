'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Floors', null, {});

    var floors = [];
    var num_floors = 4;

    for (var i = 1; i <= num_floors; i++) {
      var image = "floorplan" + (i).toString();
      var floor_number = i;

      floors.push({
        floor_number: floor_number,
        image: image,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('Floors', floors, {});

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Floors', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
