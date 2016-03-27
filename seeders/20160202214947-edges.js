'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Edges', null, {});

    var edges = [];
    var N = 40;
    var traffic = ['heavy', 'moderate', 'light'];
    var floors = 4;

    var j = 0;
    for (var i = 0; i < floors; i++) {
      var E = 15;

      var node_pairs = [];
      for (var k = 0; k < E; j++, k++) {
        var traffic_index = Math.floor(Math.random() * traffic.length);
        var source_index = null;
        var target_index = null;
        var new_pair = {};
        var pair_exist = 0;

        while (pair_exist !== undefined) {
          source_index = (Math.floor(Math.random() * 10 + 1) + (i * 10));
          target_index = (Math.floor(Math.random() * 10 + 1) + (i * 10));
          new_pair = {source: source_index, target: target_index};

          while (target_index === source_index) {
            target_index = (Math.floor(Math.random() * 10 + 1) + (i * 10));
            new_pair.target = target_index;
          }

          pair_exist = node_pairs.find(function(pair) {
            return pair === new_pair;
          });
        }


        node_pairs.push({
          source: source_index,
          target: target_index
        });

        edges.push({
          edge_id: 'e' + j,
          source: 'n' + source_index.toString(),
          target: 'n' + target_index.toString(),
          traffic: traffic[traffic_index],
          floor_number: i + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('Edges', edges, {});

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
    return queryInterface.bulkDelete('Edges', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
