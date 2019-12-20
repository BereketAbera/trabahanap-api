'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'issues',
      'CompanyProfileId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'company_profiles', 
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
      'CompanyProfileId'
    );
  }
};
