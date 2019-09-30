'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'company_profiles',
      'CityId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'cities', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        constraints: false
      }
    ).then(() => {
      return queryInterface.addColumn(
        'company_profiles',
        'RegionId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'regions', 
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          constraints: false
        }
      )
    }).then(() => {
      return queryInterface.addColumn(
        'company_profiles',
        'CountryId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'countries', 
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          constraints: false
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'company_profiles',
      'CityId'
    ).then(() => {
      return queryInterface.removeColumn(
        'company_profiles',
        'RegionId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'company_profiles',
        'CountryId'
      )
    })
  }
};