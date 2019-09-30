'use strict';
module.exports = (sequelize, DataTypes) => {
  const job = sequelize.define('job', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    jobTitle: DataTypes.STRING,
    jobDescription: DataTypes.TEXT,
    industry: DataTypes.STRING,
    position: DataTypes.STRING,
    educationAttainment: DataTypes.STRING,
    salaryRange: DataTypes.STRING,
    employmentType: DataTypes.STRING,
    vacancies: DataTypes.INTEGER,
    additionalQualifications: DataTypes.TEXT,
    applicationStartDate: DataTypes.DATE,
    applicationEndDate: DataTypes.DATE
  }, {});
  job.associate = function(models) {
    job.belongsTo(models.company_profile);
    job.belongsTo(models.location);
  };
  return job;
};