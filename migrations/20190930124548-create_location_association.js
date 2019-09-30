'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'locations',
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
        'locations',
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
        'locations',
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
    }).then(() => {
      return queryInterface.addColumn(
        'locations',
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
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'locations',
      'CityId'
    ).then(() => {
      return queryInterface.removeColumn(
        'locations',
        'RegionId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'locations',
        'CountryId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'locations',
        'CompanyProfileId'
      )
    });
  }
};