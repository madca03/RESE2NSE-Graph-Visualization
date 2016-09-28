var models = require('../../models/index');

module.exports = function(req, res, next) {
  if (req.params.type === "all") {
    var query = 'SELECT id, datetime_archive FROM datetime_archive;';

    models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
      .then(function(datetime) {
        var response = {
          'status': 'ok',
          'data': datetime
        };

        res.json(response);
      });
  } else {
    // var query = ''
    //   + 'SELECT id, datetime_archive '
    //   + 'FROM datetime_archive '
    //   + 'WHERE datetime_archive > '
    //   + 'DATE_SUB((SELECT datetime_archive FROM datetime_archive ORDER BY id '
    //   + 'DESC LIMIT 1), INTERVAL ' + req.params.range + ' '
    //   +  req.params.type + ');';
    var query = ''
      + 'SELECT id, datetime_archive '
      + 'FROM datetime_archive '
      + 'WHERE datetime_archive > '
      + 'DATE_SUB((SELECT datetime_archive FROM datetime_archive '
      + 'WHERE id = ' + req.params.last_entry_id + '), INTERVAL '
      + req.params.range + ' ' + req.params.type + ');';

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
