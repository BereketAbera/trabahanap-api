/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applicant_profiles', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    cv: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    currentEmployer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    currentOccopation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING
    },
    dateOfBirth:{
      type: DataTypes.DATE
    },
    selfDescription: {
      type: DataTypes.TEXT,
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
    CityId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    RegionId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    CountryId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id'
      }
    },
    UserId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'applicant_profiles'
  });
};
