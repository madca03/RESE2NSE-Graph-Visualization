var models = require('../../models/index');

module.exports = function(req, res, next) {
  if (req.params.limit === "all") {
    var query = 'SELECT * FROM datetime_archive;';

    models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
      .then(function(datetime) {
        var response = {
          'status': 'ok',
          'data': datetime
        };

        res.json(response);
      });
  } else {
    var range_in_secs;

    if (req.params.limit === "1min") {
      range_in_secs = 60;
    } else if (req.params.limit === "2min") {
      range_in_secs = 120;
    } else if (req.params.limit === "3min") {
      range_in_secs = 180;
    }

    var query = ''
      + 'SELECT * FROM datetime_archive '
      + 'WHERE TO_SECONDS(datetime_archive) > '
      + '(SELECT TO_SECONDS(datetime_archive) '
      + '- ' + range_in_secs + ' '
      + 'FROM datetime_archive ORDER BY id DESC LIMIT 1);';

    models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
      .then(function(datetime) {
        var response = {
          'status': 'ok',
          'data': datetime
        };

        res.json(response);
      });
  }


};
