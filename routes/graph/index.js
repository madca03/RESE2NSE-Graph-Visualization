var express = require('express');
var router = express.Router();
var models = require('../../models/index');

router.get('/nodes/display', require('./floor-display.js'));
router.get('/nodes/edit', require('./nodes-edit.js'));
router.post('/nodes/update', require('./nodes-update.js'));
router.get('/archive/floor/:floor_number/date/:date_created_id', require('./floor-archive.js'));
router.get('/nodes/:node_id', require('./node-display.js'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/graph', function(req, res, next) {
  var query = "SELECT COUNT(*) AS floor_count FROM floors";

  models.sequelize.query(query, {type: models.sequelize.QueryTypes.SELECT })
    .then(function(count) {
      var floorCount = count[0]["floor_count"];

      res.render('graph', {floorCount: floorCount})
    });
});

router.get('/node_display?', function(req, res, next) {
  var node = req.query;
  res.render('node', {node: node});
});

module.exports = router;
