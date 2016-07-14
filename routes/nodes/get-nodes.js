var models = require('../../models/index');

module.exports = function(req, res, next) {
    var query = "SELECT * FROM nodes;";

    models.sequelize.query(query, {type: models.sequelize.QueryTypes.SELECT})
      .then(function(nodes) {
        res.json({
          'status': 'ok',
          'data': {
            'nodes': nodes
          }
        });
      });
}
