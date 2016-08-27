var models = require('../../models/index');

/* This route is called when an admin user would like to edit the graph.
  This returns all of the nodes associated with the given
  floor number parameter.

  In editing the nodes on a floor, the admin user is only concerned with
  the nodes on that floor and not on the links on the floor that's why
  we return only the nodes on a floor.
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
      + 'ON (nodes.sensor_id = sensors.id) '
    + 'WHERE nodes.floor_id = '
      + req.params.floor_number + ';';

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
