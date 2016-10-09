var models = require('../../models/index');

module.exports = function(req, res, next) {
  var nodeQuery = ''
    + 'SELECT '
      + 'nodes.id, '
      + 'nodes.label, '
      + 'nodes.mac_address, '
      + 'nodes.floor_id, '
      + 'nodes_present.x_coordinate, '
      + 'nodes_present.y_coordinate, '
      + 'nodes_present.last_transmission, '
      + 'nodes_present.packets_sent, '
      + 'nodes_present.packets_received, '
      + 'sensors.type '
    + 'FROM nodes '
    + 'INNER JOIN nodes_present '
      + 'ON (nodes.id = nodes_present.node_id) '
    + 'INNER JOIN sensors '
      + 'ON (nodes.sensor_id = sensors.id) '
    + 'WHERE nodes.coordinate_set = true '
    + 'ORDER BY nodes_present.packets_sent ASC;';

  models.sequelize.query(nodeQuery, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(nodes) {
      var response = {
        'status': 'ok',
        'data': nodes
      };

      res.json(response);
    });
};
