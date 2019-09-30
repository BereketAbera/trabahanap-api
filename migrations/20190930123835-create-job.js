'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      jobTitle: {
        type: Sequelize.STRING
      },
      jobDescription: {
        type: Sequelize.TEXT
      },
      industry: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      educationAttainment: {
        type: Sequelize.STRING
      },
      salaryRange: {
        type: Sequelize.STRING
      },
      employmentType: {
        type: Sequelize.STRING
      },
      vacancies: {
        type: Sequelize.INTEGER
      },
      additionalQualifications: {
        type: Sequelize.TEXT
      },
      applicationStartDate: {
        type: Sequelize.DATE
      },
      applicationEndDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('jobs');
  }
};