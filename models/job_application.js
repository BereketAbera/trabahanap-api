'use strict';
module.exports = (sequelize, DataTypes) => {
  const job_application = sequelize.define('job_application', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID
    },
    applicationDate: DataTypes.DATE
  }, {});
  job_application.associate = function(models) {
    job_application.belongsTo(models.job);
    job_application.belongsTo(models.applicant_profile);
    job_application.belongsTo(models.company_profile);
  };
  return job_application;
};