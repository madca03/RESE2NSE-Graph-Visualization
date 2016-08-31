var models = require('../../models/index');

/* This route is called when an admin user would like to edit the graph.
  This route returns all of the nodes.

  In editing the nodes, the admin user is only concerned with
  the nodes and not on the links that's why we return only the nodes.
  (BASTA NODES LANG IPASA hahaha haba pa ng sinabi ko.)
*/

module.exports = function(req, res, next) {
  var node_query = ''
    + 'SELECT '
      + 'nodes.id, '
      + 'nodes.label, '
      + 'nodes.coordinate_set AS fixed, '
      + 'nodes_present.x_coordinate AS x, '
      + 'nodes_present.y_coordinate AS y, '
      + 'sensors.type '
    + 'FROM nodes '
    + 'INNER JOIN nodes_present '
      + 'ON (nodes.id = nodes_present.node_id) '
    + 'INNER JOIN sensors '
      + 'ON (nodes.sensor_id = sensors.id);'

  models.sequelize.query(node_query, { type: models.sequelize.QueryTypes.SELECT })  // Query all the nodes
    .then(function(nodes) {
        var response = {
          'status': 'ok',
          'data': {
            'graph': {
              'nodes': nodes
            }
          }
        };

        res.json(response);
    });
}
