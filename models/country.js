'use strict';
module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    countryName: DataTypes.STRING
  }, {});
  country.associate = function(models) {
    // associations can be defined here
  };
  return country;
};