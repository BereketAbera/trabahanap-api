'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('applicant_reports', {
      datefield: {
        primaryKey: true,
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      googles: {
        type: Sequelize.INTEGER
      },
      facebooks:{
        type: Sequelize.INTEGER
      },
      normals:{
        type: Sequelize.INTEGER
      },
      dailyRegistrations:{
        type: Sequelize.INTEGER
      },
      subTotal:{
        type: Sequelize.INTEGER
      },
      dailyLogins:{
        type: Sequelize.INTEGER
      },
      activeUsers:{
        type: Sequelize.INTEGER
      },
      returningUsers:{
        type: Sequelize.INTEGER
      },
      dailyApplications:{
        type: Sequelize.INTEGER
      },
      dailyUniqueApplicants:{
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('applicant_reports');
  }
};
