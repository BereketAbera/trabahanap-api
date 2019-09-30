'use strict';
module.exports = (sequelize, DataTypes) => {
  const region = sequelize.define('region', {
    regionName: DataTypes.STRING
  }, {});
  region.associate = function(models) {
    region.belongsTo(models.country)
  };
  return region;
};