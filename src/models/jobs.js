/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jobs', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    jobTitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pwd: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    educationAttainment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    salaryRange: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    employmentType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vacancies: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    additionalQualifications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    applicationStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    applicationEndDate: {
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
    LocationId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id'
      }
    }
  }, {
    tableName: 'jobs'
  });
};
