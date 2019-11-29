'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'issues',
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
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'issues',
      'ApplicantProfileId'
    );
  }
};
