'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    locationName: DataTypes.STRING,
    locationPhoneNumber: DataTypes.STRING,
    isHeadOffice: DataTypes.BOOLEAN,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING
  }, {});
  location.associate = function(models) {
    location.belongsTo(models.city);
    location.belongsTo(models.region);
    locations.belongsTo(models.country);
    location.belongsTo(models.company_profile);
  };
  return location;
};