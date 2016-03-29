var express = require('express');
var router = express.Router();
var models = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/graph', function(req, res, next) {
  res.render('graph');
});

/* This route is being called by an ajax call when the application is in view mode.
  It returns a JSON data containing the nodes having a defined x and y coordinates
  and edges having defined source and target coordinates.
*/
router.get('/nodes_for_display', function(req, res, next) {
  // edge query = SELECT * FROM "Edges" WHERE "source" IN (SELECT "node_id" FROM "Nodes"
  // WHERE "coordinate_set"=true) AND "target" IN (SELECT "node_id" FROM "Nodes" WHERE "coordinate_set"=true);


  var node_query = 'SELECT node_id AS id, label, x AS x_coordinate, '
    + 'y AS y_coordinate, sensor_type, mac_address, last_transmission, '
    + 'packets_sent, packets_received, floor_number FROM Nodes '
    + 'WHERE coordinate_set=true;';
  var edge_query = 'SELECT edge_id AS id, source, target, traffic, '
    + 'floor_number FROM Edges '
    + 'WHERE source IN (SELECT node_id FROM Nodes WHERE coordinate_set=true) '
    + 'AND target IN (SELECT node_id FROM Nodes WHERE coordinate_set=true);';

  models.sequelize.query(node_query, { type: models.sequelize.QueryTypes.SELECT })  // Query the nodes
    .then(function(nodes) {
      models.sequelize.query(edge_query, { type: models.sequelize.QueryTypes.SELECT })  // Query the edges
        .then(function(edges) {
          var graph = { // form the graph object containing the nodes and edges data
            'nodes': nodes,
            'links': edges
          };
          res.json(graph);  // send graph data as JSON
        });
    });
});

/* This route is called when an admin user would like to edit the graph.
  This returns all of the nodes and edges associated with the given
  floor number parameter.
*/
router.get('/nodes/:floor_number', function(req, res, next) {
  var node_query = 'SELECT node_id AS id, label, x AS x_coordinate, y AS y_coordinate, '
    + 'sensor_type, mac_address, last_transmission, packets_sent, packets_received, '
    + 'coordinate_set AS fixed FROM Nodes WHERE floor_number='
    + req.params.floor_number + ';';
  var edge_query = 'SELECT edge_id AS id, source, target, traffic '
    + 'FROM Edges WHERE floor_number=' + req.params.floor_number + ';';

  models.sequelize.query(node_query, { type: models.sequelize.QueryTypes.SELECT })  // Query all the nodes
    .then(function(nodes) {
      models.sequelize.query(edge_query, { type: models.sequelize.QueryTypes.SELECT })  // Query all the edges
        .then(function(edges) {
            var graph = {
              'nodes': nodes,
              'links': edges
            };
            res.json(graph);
        });
    });
});

router.post('/nodes/update', function(req, res, next) {
  var nodes = JSON.parse(req.body.nodes);

  nodes.forEach(function(updatedNode) {
    var query = 'Update Nodes SET x = '
      + updatedNode.x
      + ', y = '
      + updatedNode.y
      + ', coordinate_set = true'
      + ' WHERE node_id = \''
      + updatedNode.id +'\';';

    models.sequelize.query(query).spread(function(results, metadata) {});
  });

  res.send({});
});

module.exports = router;
