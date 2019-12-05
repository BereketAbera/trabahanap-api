/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('issues', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      issueReason: {
        type: DataTypes.STRING
      },
      issueType:{
        type: DataTypes.STRING
      },
      issueDescription:{
        type: DataTypes.STRING
      },
      IssueResponseId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'issue_responses',
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'issues'
    });
  };
  