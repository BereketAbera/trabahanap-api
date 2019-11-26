'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'job_later_reviews',
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
        'job_later_reviews',
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
      'job_later_reviews',
      'ApplicantProfileId'
    ).then(() => {
      return queryInterface.removeColumn(
        'job_later_reviews',
        'JobId'
      )
    });
  }
};