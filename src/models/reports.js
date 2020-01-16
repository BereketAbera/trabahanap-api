/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('reports', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      reportType: {
        type: DataTypes.STRING
      },
      comment:{
        type: DataTypes.STRING
      },
      checked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'reports'
    });
  };
  