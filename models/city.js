'use strict';
module.exports = (sequelize, DataTypes) => {
  const city = sequelize.define('city', {
    cityName: DataTypes.STRING
  }, {});
  city.associate = function(models) {
    // associations can be defined here
  };
  return city;
};