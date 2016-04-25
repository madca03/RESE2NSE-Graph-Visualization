'use strict';
module.exports = function(sequelize, DataTypes) {
  var Datetime_archive = sequelize.define('Datetime_archive', {
    datetime_archive: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Datetime_archive;
};