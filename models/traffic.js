'use strict';
module.exports = function(sequelize, DataTypes) {
  var Traffic = sequelize.define('Traffic', {
    status: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Traffic;
};