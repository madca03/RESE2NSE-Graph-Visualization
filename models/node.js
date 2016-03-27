'use strict';
module.exports = function(sequelize, DataTypes) {
  var Node = sequelize.define('Node', {
    node_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    x: {
      type: DataTypes.DOUBLE,
      // allowNull: false,
      defaultValue: null
    },
    y: {
      type: DataTypes.DOUBLE,
      // allowNull: false,
      defaultValue: null
    },
    coordinate_set: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sensor_type: {
      type: DataTypes.STRING
    },
    mac_address: {
      type: DataTypes.STRING
    },
    last_transmission: {
      type: DataTypes.STRING
    },
    packets_sent: {
      type: DataTypes.INTEGER
    },
    packets_received: {
      type: DataTypes.INTEGER
    },
    floor_number: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Node;
};
