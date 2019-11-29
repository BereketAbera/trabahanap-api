'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'issue_responses',
      'IssueId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'issues', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        constraints: false
      }
    ).then(() => {
      return queryInterface.addColumn(
        'issue_responses',
        'UserId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'users', 
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          constraints: false
        }
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'issue_responses',
      'IssueId'
    ).then(() => {
      return queryInterface.removeColumn(
        'issue_responses',
        'UserId'
      )
    });
  }
};
