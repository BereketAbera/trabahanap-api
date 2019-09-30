'use strict';
module.exports = (sequelize, DataTypes) => {
  const city = sequelize.define('city', {
    cityName: DataTypes.STRING
  }, {});
  city.associate = function(models) {
    city.belongsTo(models.region)
  };
  return city;
};