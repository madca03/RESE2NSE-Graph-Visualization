'use strict';
module.exports = function(sequelize, DataTypes) {
  var Edge = sequelize.define('Edge', {
    edge_id: {
      type: DataTypes.STRING
    },
    source: {
      type: DataTypes.STRING
    },
    target: {
      type: DataTypes.STRING
    },
    traffic: {
      type: DataTypes.STRING
    },
    floor_number: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Edge;
};
