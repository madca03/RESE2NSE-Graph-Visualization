'use strict';
module.exports = function(sequelize, DataTypes) {
  var nodes_present = sequelize.define('nodes_present', {
    node_id: DataTypes.INTEGER,
    x: DataTypes.DOUBLE,
    y: DataTypes.DOUBLE,
    coordinate_set: DataTypes.BOOLEAN,
    last_transmission: DataTypes.STRING,
    packets_sent: DataTypes.INTEGER,
    packets_received: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return nodes_present;
};
