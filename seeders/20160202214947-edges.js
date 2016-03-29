'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Edges', null, {});

    var edges = [];
    var traffic = ['heavy', 'moderate', 'light'];
    var floors = 4;
    var N = 10;

    var j = 0;
    for (var i = 0; i < floors; i++) {
      var E = 15;

      var node_pairs = [];
      for (var k = 0; k < E; j++, k++) {
        var traffic_index = Math.floor(Math.random() * traffic.length);
        var source_index = null;
        var target_index = null;
        var new_pair = {};
        var pair_exist = null;

        while (pair_exist !== undefined) {
          source_index = (Math.floor(Math.random() * N + 1) + (i * N));
          target_index = (Math.floor(Math.random() * N + 1) + (i * N));
          new_pair = {source: source_index, target: target_index};

          while (target_index === source_index) {
            target_index = (Math.floor(Math.random() * N + 1) + (i * N));
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
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Edges', null, {});
  }
};
