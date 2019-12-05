'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'issues',
      'IssueResponseId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'issue_responses', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        constraints: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'issues',
      'IssueResponseId'
    );
  }
};
