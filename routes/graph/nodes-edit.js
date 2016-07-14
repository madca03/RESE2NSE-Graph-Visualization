var models = require('../../models/index');

/* This route is called when an admin user would like to edit the graph.
  This returns all of the nodes and edges associated with the given
  floor number parameter.
*/
module.exports = function(req, res, next) {
  var node_query = ''
    + 'SELECT '
      + 'nodes.id, '
      + 'nodes.label, '
      + 'nodes.mac_address, '
      + 'nodes_present.last_transmission, '
      + 'nodes_present.packets_sent, '
      + 'nodes_present.packets_received, '
      + 'nodes_present.coordinate_set AS fixed, '
      + 'nodes_present.x_coordinate, '
      + 'nodes_present.y_coordinate, '
      + 'sensors.type '
    + 'FROM nodes '
    + 'INNER JOIN nodes_present '
      + 'ON (nodes.id = nodes_present.node_id) '
    + 'INNER JOIN sensors '
      + 'ON (nodes.sensor_id = sensors.id) '
    + 'WHERE nodes.floor_id = '
      + req.params.floor_number + ';';

    var link_query = ''
      + 'SELECT '
        + 'links_present.id, '
        + 'links_present.source_id, '
        + 'links_present.target_id, '
        + 'traffic.status '
      + 'FROM links_present '
      + 'INNER JOIN traffic '
        + 'ON (links_present.traffic_id = traffic.id) '
      + 'WHERE links_present.floor_id = '
      + req.params.floor_number + ';';

  models.sequelize.query(node_query, { type: models.sequelize.QueryTypes.SELECT })  // Query all the nodes
    .then(function(nodes) {
      models.sequelize.query(link_query, { type: models.sequelize.QueryTypes.SELECT })  // Query all the edges
        .then(function(links) {
            var response = {
              'status': 'ok',
              'data': {
                'graph': {
                  'nodes': nodes,
                  'links': links
                }
              }
            };

            res.json(response);
        });
    });
}
