/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('job_later_reviews', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
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
    tableName: 'job_later_reviews'
  });
};
