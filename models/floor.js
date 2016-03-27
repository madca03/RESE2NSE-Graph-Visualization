'use strict';
module.exports = function(sequelize, DataTypes) {
  var Floor = sequelize.define('Floor', {
    floor_number: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    image: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Floor;
};
