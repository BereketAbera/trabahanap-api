'use strict';
module.exports = (sequelize, DataTypes) => {
  const company_profile = sequelize.define('company_profile', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    zipcode: DataTypes.STRING,
    companyName: DataTypes.STRING,
    contactPerson: DataTypes.STRING,
    contactNumber: DataTypes.INTEGER,
    websiteURL: DataTypes.STRING,
    industryType: DataTypes.STRING,
    companyLogo: DataTypes.STRING,
    companyDescriptioin: DataTypes.TEXT,
    businessLicense: DataTypes.TEXT,
    businessLicenseNumber: DataTypes.INTEGER,
    companyAddress: DataTypes.STRING
  }, {});
  company_profile.associate = function(models) {
    company_profile.belongsTo(models.city);
    company_profile.belongsTo(models.region);
    company_profile.belongsTo(models.country);
    company_profile.hasMany(models.user)
  };
  return company_profile;
};