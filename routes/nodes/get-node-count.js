var models = require('../../models/index');

module.exports = function(req, res, next) {
  var query = "SELECT COUNT(*) FROM nodes;";

  models.sequelize.query(query, {type: models.sequelize.QueryTypes.SELECT})
    .then(function(count) {
      var count = count[0]["COUNT(*)"];
      res.json({
        'status': 'ok',
        'data': {
          'node_count': count
        }
      });
    });
}
