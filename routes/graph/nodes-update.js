var models = require('../../models/index');

module.exports =  function(req, res, next) {
  var nodes = JSON.parse(req.body.nodes);

  nodes.forEach(function(updatedNode) {
    var query = ''
      + 'UPDATE nodes_present '
      + 'SET x_coordinate = ' + updatedNode.x_coordinate + ', '
      + 'y_coordinate = ' + updatedNode.y_coordinate + ', '
      + 'coordinate_set = true '
      + 'WHERE node_id = ' + updatedNode.id + ';';

    models.sequelize.query(query).spread(function(results, metadata) {});
  });

  res.send({});
}
