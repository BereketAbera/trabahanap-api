/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('issue_responses', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      issueResponse:{
        type: DataTypes.STRING
      },
      UserId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      IssueId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: 'issues',
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
      tableName: 'issue_responses'
    });
  };
  