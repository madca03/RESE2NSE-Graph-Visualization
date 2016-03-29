'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Nodes', null, {});
    var nodes = get_nodes();
    var sensor = ['Humidity', 'Temperature', 'Light Intensity', 'Pressure'];

    var mac_address = [
      'D7-74-55-47-AB-07', 'DD-61-A3-D8-F9-C6', 'DD-70-C5-9B-D0-41',
      '99-E6-96-AA-A1-33', '69-81-38-8F-58-AC', 'F3-EA-61-C5-E9-CC',
      '56-C6-26-8D-02-DC', '3C-8C-BD-6B-AE-22', '84-8C-FD-DE-24-AC'
    ]

    for (var i = 0; i < nodes.length; i++) {
        var sensor_index = Math.floor(Math.random() * sensor.length);
        var mac_index = Math.floor(Math.random() * mac_address.length);
        var last_transmission = (Math.random() + 1).toString(36).substring(7);
        var packets_sent = Math.floor(Math.random() * 100);
        var packets_received = Math.floor(Math.random() * 100);

        nodes[i].sensor_type = sensor[sensor_index];
        nodes[i].mac_address = mac_address[mac_index];
        nodes[i].last_transmission = last_transmission;
        nodes[i].packets_sent = packets_sent;
        nodes[i].packets_received = packets_received;
        nodes[i].createdAt = new Date();
        nodes[i].updatedAt = new Date();
    }

    return queryInterface.bulkInsert('Nodes', nodes, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Nodes', null, {});
  }
};

function get_nodes() {
  var floors = 4;
  var j = 1;
  var nodes = [];

  for (var i = 0; i < floors; i++) {
    var N = 10;

    for (var k = 0; k < N; k++) {
        var new_node = {
          node_id: 'n' + j,
          label: 'Node' + j,
          floor_number: i + 1
        };
        j++;
        nodes.push(new_node);
    }
  }

  return nodes;
}
