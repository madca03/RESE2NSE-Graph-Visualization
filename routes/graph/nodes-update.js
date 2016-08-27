var models = require('../../models/index');

module.exports =  function(req, res, next) {
  var nodes = JSON.parse(req.body.nodes);

  nodes.forEach(function(updatedNode) {
    var update_nodes_present_query = ''
      + 'UPDATE nodes_present '
      + 'SET x_coordinate = ' + updatedNode.x_coordinate + ', '
      + 'y_coordinate = ' + updatedNode.y_coordinate + ' '
      + 'WHERE node_id = ' + updatedNode.id + ';';

    var update_nodes_query = ''
      + 'UPDATE nodes '
      + 'SET coordinate_set = true '
      + 'WHERE id = ' + updatedNode.id + ';';

    models.sequelize.query(update_nodes_present_query, { type: models.sequelize.QueryTypes.UPDATE })
      .then(function() {
        models.sequelize.query(update_nodes_query, { type: models.sequelize.QueryTypes.UPDATE })
          .then(function() {})
      });

  });

  res.send({});
}
