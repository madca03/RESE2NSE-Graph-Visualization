var models = require('../../models/index');

module.exports = function(req, res, next) {
    var node_query = ''
      + 'SELECT '
        + 'nodes.id, '
        + 'nodes.label, '
        + 'nodes.mac_address, '
        + 'nodes.floor_id, '
        + 'nodes_archive.x_coordinate, '
        + 'nodes_archive.y_coordinate, '
        + 'nodes_archive.last_transmission, '
        + 'nodes_archive.packets_sent, '
        + 'nodes_archive.packets_received, '
        + 'sensors.type '
      + 'FROM nodes '
      + 'INNER JOIN nodes_archive '
        + 'ON (nodes.id = nodes_archive.node_id) '
      + 'INNER JOIN sensors '
        + 'ON (nodes.sensor_id = sensors.id) '
      + 'WHERE nodes_archive.coordinate_set = true '
      + 'AND nodes.floor_id = ' + req.params.floor_number + ' '
      + 'AND nodes_archive.date_created_id = ' + req.params.date_created_id + ';';

    var link_query = ''
      + 'SELECT '
        + 'links_archive.id, '
        + 'links_archive.source_id, '
        + 'links_archive.target_id, '
        + 'links_archive.floor_id, '
        + 'traffic.status '
      + 'FROM links_archive '
      + 'INNER JOIN traffic '
        + 'ON (links_archive.traffic_id = traffic.id) '
      + 'WHERE links_archive.source_id '
        + 'IN (SELECT node_id FROM nodes_archive '
        + 'WHERE coordinate_set = true '
        + 'AND date_created_id = ' + req.params.date_created_id + ') '
      + 'AND links_archive.target_id '
        + 'IN (SELECT node_id FROM nodes_present '
        + 'WHERE coordinate_set = true '
        + 'AND date_created_id = ' + req.params.date_created_id + ') '
      + 'AND links_archive.floor_id = ' + req.params.floor_number + ' '
      + 'AND links_archive.date_created_id = ' + req.params.date_created_id + ';';

    models.sequelize.query(node_query, {type: models.sequelize.QueryTypes.SELECT})
      .then(function(nodes) {
        models.sequelize.query(link_query, {type: models.sequelize.QueryTypes.SELECT})
          .then(function(links) {
              var response = {
                'status': 'ok',
                'data': {
                  'graph': {
                    'nodes': nodes,
                    'links': links
                  }
                }
              };

              res.json(response);
          });
      });
}
