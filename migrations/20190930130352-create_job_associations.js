'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'jobs',
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
    ).then(() => {
      return queryInterface.addColumn(
        'jobs',
        'LocationId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'locations', 
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
      'jobs',
      'CompanyProfileId'
    ).then(() => {
      return queryInterface.removeColumn(
        'jobs',
        'LocationId'
      )
    });
  }
};