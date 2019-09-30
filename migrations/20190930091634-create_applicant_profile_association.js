'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'cities',
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
    ).then(() => {
      return queryInterface.addColumn(
        'regions',
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
        'applicant_profiles',
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
      )
    }).then(() => {
      return queryInterface.addColumn(
        'applicant_profiles',
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
        'applicant_profiles',
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
        'applicant_profiles',
        'UserId', 
        {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id',
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
      'cities',
      'RegionId'
    ).then(() => {
      return queryInterface.removeColumn(
        'regions',
        'CountryId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'applicant_profiles',
        'CityId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'applicant_profiles',
        'RegionId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'applicant_profiles',
        'CountryId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'applicant_profiles',
        'UserId'
      )
    });
  }
};