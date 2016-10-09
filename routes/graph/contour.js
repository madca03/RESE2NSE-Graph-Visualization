var models = require('../../models/index');

module.exports = function(req, res, next) {
  query = 'SELECT x_coordinate, y_coordinate, packets_sent FROM nodes_present;';

  x_query = 'SELECT id, x_coordinate, y_coordinate, packets_sent FROM nodes_present ORDER BY x_coordinate ASC;';
  y_query = 'SELECT id, y_coordinate FROM nodes_present ORDER BY y_coordinate ASC;';
  //z_query = 'SELECT id, packets_sent FROM nodes_present;';

  models.sequelize.query(x_query, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(data) {
      models.sequelize.query(y_query, { type: models.sequelize.QueryTypes.SELECT })
        .then(function(y_coordinate) {
          var x = {coordinates: [], ids: []};
          var y = {coordinates: [], ids: []};
          var z = [];

          for (var i = 0; i < data.length; i++) {
            x.coordinates.push(data[i].x_coordinate);
            x.ids.push(data[i].id);
            y.coordinates.push(y_coordinate[i].y_coordinate);
            y.ids.push(y_coordinate[i].id);
          }

          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length; j++) {
              if (x.ids[i] === y.ids[j]) break;
            }

            var temp = [];
            for (var k = 0; k < j; k++) temp.push(null);
            temp.push(data[j].packets_sent);
            for (var k = 0; k < data.length - j - 1; k++) temp.push(null);

            z.push(temp);
          }

          console.log(x);
          console.log(y);
          console.log(z);

          var response = {
            'status': 'ok',
            'x': x,
            'y': y,
            'z': z
          };

          res.json(response);
        });
    });

/*
  models.sequelize.query(x_query, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(x_coordinate) {
      models.sequelize.query(y_query, { type: models.sequelize.QueryTypes.SELECT })
        .then(function(y_coordinate) {
          models.sequelize.query(z_query, { type: models.sequelize.QueryTypes.SELECT })
            .then(function(packets_sent) {
              var x = {coordinates: [], ids: []};
              var y = {coordinates: [], ids: []};

              for (var i = 0; i < x_coordinate.length; i++) {
                x.coordinates.push(x_coordinate[i].x_coordinate);
                x.ids.push(x_coordinate[i].id);
                y.coordinates.push(y_coordinate[i].y_coordinate);
                y.ids.push(y_coordinate[i].id);
              }

              for (var i = 0; i < x_coordinate.length; i++) {
                for (var j = 0; j < y_coordinate.length; j++) {
                  if (y_coordinate[j].id === x_coordinate[i].id) break;
                }


              }

              var response = {
                'status': 'ok',
                'data': {
                  'x': x,
                  'y': y,
                  'z': packets_sent
                }
              };

              res.json(response);
            });
        });
    });
*/

  // models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT })
  //   .then(function(data) {
  //     var response = {
  //       'status': 'ok',
  //       'data': data
  //     };
  //
  //     res.json(response);
  //   });
};
