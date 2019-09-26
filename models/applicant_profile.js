'use strict';
module.exports = (sequelize, DataTypes) => {
  const applicant_profile = sequelize.define('applicant_profile', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    cv: DataTypes.STRING,
    currentEmployer: DataTypes.STRING,
    currentOccopation: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    selfDescription: DataTypes.TEXT
  }, {});
  applicant_profile.associate = function(models) {
    // associations can be defined here
  };
  return applicant_profile;
};