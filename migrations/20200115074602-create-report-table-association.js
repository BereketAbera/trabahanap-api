'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reports',
      'ApplicantProfileId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'applicant_profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        constraints: false
      }
    ).then(() => {
      return queryInterface.addColumn(
        'reports',
        'JobId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'jobs',
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
      'reports',
      'ApplicantProfileId'
    ).then(() => {
      return queryInterface.removeColumn(
        'reports',
        'JobId'
      )
    });
  }
};
