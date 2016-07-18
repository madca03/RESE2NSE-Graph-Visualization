var models = require('../../models/index');

module.exports = function(req, res, next) {
  var query = ''
    + 'SELECT '
      + 'nodes.label, '
      + 'nodes.mac_address, '
      + 'nodes.floor_id, '
      + 'sensors.type, '
      + 'nodes_present.x_coordinate, '
      + 'nodes_present.y_coordinate, '
      + 'nodes_present.last_transmission, '
      + 'nodes_present.packets_sent, '
      + 'nodes_present.packets_received '
    + 'FROM nodes '
    + 'INNER JOIN nodes_present '
      + 'ON (nodes.id = nodes_present.node_id) '
    + 'INNER JOIN sensors '
      + 'ON (nodes.sensor_id = sensors.id) '
    + 'WHERE nodes.id = ' + req.params.node_id + ';';

  models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(nodes) {
      var node = nodes[0];
      var response = {
        'status': 'ok',
        'data': node
      };
      res.json(response);
    });
}
