'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Nodes', null, {});
    // var nodes = [];
    // var N = 20;
    // var sensor = ['Humidity', 'Temperature', 'Light Intensity', 'Pressure'];
    //
    // var mac_address = [
    //   'D7-74-55-47-AB-07', 'DD-61-A3-D8-F9-C6', 'DD-70-C5-9B-D0-41',
    //   '99-E6-96-AA-A1-33', '69-81-38-8F-58-AC', 'F3-EA-61-C5-E9-CC',
    //   '56-C6-26-8D-02-DC', '3C-8C-BD-6B-AE-22', '84-8C-FD-DE-24-AC'
    // ]
    //
    // for (var i = 0; i < N; i++) {
    //   var sensor_index = Math.floor(Math.random() * sensor.length);
    //   var mac_index = Math.floor(Math.random() * mac_address.length);
    //   var last_transmission = (Math.random() + 1).toString(36).substring(7);
    //   var packets_sent = Math.floor(Math.random() * 100);
    //   var packets_received = Math.floor(Math.random() * 100);
    //   var floor_number = Math.floor(Math.random() * 5);
    //
    //   nodes.push({
    //     node_id: 'n' + i,
    //     label: 'Node ' + i,
    //     sensor_type: sensor[sensor_index],
    //     mac_address: mac_address[mac_index],
    //     last_transmission: last_transmission,
    //     packets_sent: packets_sent,
    //     packets_received: packets_received,
    //     floor_number: floor_number,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   });
    // }

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
    return queryInterface.bulkDelete('Nodes', null, {});

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};

function get_nodes() {
  var nodes = [
    {node_id: 'n1', label: 'Node1', floor_number: 1},
    {node_id: 'n2', label: 'Node2', floor_number: 1},
    {node_id: 'n3', label: 'Node3', floor_number: 1},
    {node_id: 'n4', label: 'Node4', floor_number: 1},
    {node_id: 'n5', label: 'Node5', floor_number: 1},
    {node_id: 'n6', label: 'Node6', floor_number: 1},
    {node_id: 'n7', label: 'Node7', floor_number: 1},
    {node_id: 'n8', label: 'Node8', floor_number: 1},
    {node_id: 'n9', label: 'Node9', floor_number: 1},
    {node_id: 'n10', label: 'Node10', floor_number: 1},
    {node_id: 'n11', label: 'Node11', floor_number: 2},
    {node_id: 'n12', label: 'Node12', floor_number: 2},
    {node_id: 'n13', label: 'Node13', floor_number: 2},
    {node_id: 'n14', label: 'Node14', floor_number: 2},
    {node_id: 'n15', label: 'Node15', floor_number: 2},
    {node_id: 'n16', label: 'Node16', floor_number: 2},
    {node_id: 'n17', label: 'Node17', floor_number: 2},
    {node_id: 'n18', label: 'Node18', floor_number: 2},
    {node_id: 'n19', label: 'Node19', floor_number: 2},
    {node_id: 'n20', label: 'Node20', floor_number: 2},
    {node_id: 'n21', label: 'Node21', floor_number: 3},
    {node_id: 'n22', label: 'Node22', floor_number: 3},
    {node_id: 'n23', label: 'Node23', floor_number: 3},
    {node_id: 'n24', label: 'Node24', floor_number: 3},
    {node_id: 'n25', label: 'Node25', floor_number: 3},
    {node_id: 'n26', label: 'Node26', floor_number: 3},
    {node_id: 'n27', label: 'Node27', floor_number: 3},
    {node_id: 'n28', label: 'Node28', floor_number: 3},
    {node_id: 'n29', label: 'Node29', floor_number: 3},
    {node_id: 'n30', label: 'Node30', floor_number: 3},
    {node_id: 'n31', label: 'Node31', floor_number: 4},
    {node_id: 'n32', label: 'Node32', floor_number: 4},
    {node_id: 'n33', label: 'Node33', floor_number: 4},
    {node_id: 'n34', label: 'Node34', floor_number: 4},
    {node_id: 'n35', label: 'Node35', floor_number: 4},
    {node_id: 'n36', label: 'Node36', floor_number: 4},
    {node_id: 'n37', label: 'Node37', floor_number: 4},
    {node_id: 'n38', label: 'Node38', floor_number: 4},
    {node_id: 'n39', label: 'Node39', floor_number: 4},
    {node_id: 'n40', label: 'Node40', floor_number: 4}
  ];

  return nodes;
}
