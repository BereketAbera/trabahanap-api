/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('job_applications', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    applicationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CompanyProfileId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'company_profiles',
        key: 'id'
      }
    },
    ApplicantProfileId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'applicant_profiles',
        key: 'id'
      }
    },
    JobId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'jobs',
        key: 'id'
      }
    }
  }, {
    tableName: 'job_applications'
  });
};
