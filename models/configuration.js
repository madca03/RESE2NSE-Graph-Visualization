'use strict';
module.exports = function(sequelize, DataTypes) {
  var Configuration = sequelize.define('Configuration', {
    base_browser_width: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Configuration;
};