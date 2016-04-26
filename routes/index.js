var express = require('express');
var router = express.Router();
var models = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/graph', function(req, res, next) {
  var query = "SELECT COUNT(*) FROM floors";

  models.sequelize.query(query, {type: models.sequelize.QueryTypes.SELECT })
    .then(function(count) {
      var floorCount = count[0]["COUNT(*)"];

      res.render('graph', {floorCount: floorCount})
    });
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

  // var archive_date_query = 'SELECT CONVERT_TZ(datetime_archive, "+00:00", "+08:00") '
  //   + 'AS datetime_archive FROM Datetime_archives ORDER BY id ASC;';
  var archive_date_query = 'SELECT datetime_archive FROM Datetime_archives ORDER BY id ASC;';

  // var archive_date_query = 'SELECT COUNT(*) FROM Datetime_archives ORDER BY id ASC;';

  models.sequelize.query(node_query, { type: models.sequelize.QueryTypes.SELECT })  // Query the nodes
    .then(function(nodes) {
      models.sequelize.query(edge_query, { type: models.sequelize.QueryTypes.SELECT })  // Query the edges
        .then(function(edges) {
          models.sequelize.query(archive_date_query, { type: models.sequelize.QueryTypes.SELECT }) // Query the archive_count
            .then(function(archive_date) {
              var graph = { // form the graph object containing the nodes and edges data
                'nodes': nodes,
                'links': edges
              };

              var response = {
                // 'archive_count': count[0]["COUNT(*)"],
                'archive_date': archive_date,
                'archive_count': archive_date.length,
                'graph': graph
              }

              res.json(response);  // send graph data as JSON
            });
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

router.get('/node/:node_id', function(req, res, next) {
  var nodeID = req.params.node_id;
  var nodeQuery = "SELECT * FROM Nodes WHERE node_id=" + "'" + nodeID + "'" + ";";

  models.sequelize.query(nodeQuery, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(nodes) {
      var node = nodes[0];
      res.render('node', {node: node});
    });
});

router.get('/archive_count', function(req, res, next) {
  var query = "SELECT COUNT(*) FROM Datetime_archives;";

  models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(count) {
      res.json({ 'archive_count':count[0]["COUNT(*)"] });
    });
});

router.get('/archive/floor/:floor_number/date/:date_id', function(req, res, next) {
  var date_query = "SELECT datetime_archive FROM Datetime_archives WHERE id = "
    + req.params.date_id + ";";

  // query first the datetime of the archive that needs to be displated.
  models.sequelize.query(date_query, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(data) {
      var datetime_archive = data[0].datetime_archive;
      // var datetime_archive = new Date(data[0].datetime_archive);

      var year = datetime_archive.getUTCFullYear();
      // Date.getMonth() returns 0 to 11 so add +1 so that the month variable
      // will be from 1 to 12
      var month = datetime_archive.getUTCMonth() + 1;
      var date = datetime_archive.getUTCDate();
      var hours = datetime_archive.getUTCHours();
      var minutes = datetime_archive.getUTCMinutes();
      var seconds = datetime_archive.getUTCSeconds();

      var formatted_datetime_archive = year + "-" + month + "-" + date + " "
        + hours + ":" + minutes + ":" + seconds;

      // get the nodes and edges for the specific datetime of archive.
      var node_query = 'SELECT node_id AS id, label, x AS x_coordinate, '
        + 'y AS y_coordinate, sensor_type, mac_address, last_transmission, '
        + 'packets_sent, packets_received, floor_number FROM Node_archives '
        + 'WHERE coordinate_set=true AND createdAt="'
        + formatted_datetime_archive + '" '
        + 'AND floor_number=' + req.params.floor_number
        + ';';

      var edge_query = 'SELECT edge_id AS id, source, target, traffic, '
        + 'floor_number FROM Edge_archives '
        + 'WHERE source IN '
        + '(SELECT node_id FROM Node_archives WHERE coordinate_set=true '
        + 'AND createdAt="' + formatted_datetime_archive + '" '
        + 'AND floor_number=' + req.params.floor_number + ') '
        + 'AND target IN '
        + '(SELECT node_id FROM Node_archives WHERE coordinate_set=true '
        + 'AND createdAt="' + formatted_datetime_archive + '" '
        + 'AND floor_number=' + req.params.floor_number + ') '
        + 'AND createdAt="' + formatted_datetime_archive + '" '
        + 'AND floor_number=' + req.params.floor_number
        + ';';

      console.log(node_query);

      models.sequelize.query(node_query, { type: models.sequelize.QueryTypes.SELECT })
        .then(function(nodes) {
          models.sequelize.query(edge_query, { type: models.sequelize.QueryTypes.SELECT })
            .then(function(edges) {
              var graph = {
                'nodes': nodes,
                'links': edges
              };

              res.json(graph);
            });
        });
    });
});

module.exports = router;
