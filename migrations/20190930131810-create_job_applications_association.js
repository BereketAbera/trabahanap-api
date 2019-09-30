'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'job_applications',
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
        'job_applications',
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
      )
    }).then(() => {
      return queryInterface.addColumn(
        'job_applications',
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
      'job_applications',
      'CompanyProfileId'
    ).then(() => {
      return queryInterface.removeColumn(
        'job_applications',
        'ApplicantProfileId'
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'job_applications',
        'JobId'
      )
    });
  }
};