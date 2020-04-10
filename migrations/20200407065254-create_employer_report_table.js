'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('employer_reports', {
      datefield: {
        primaryKey: true,
        type: Sequelize.DATEONLY,
        allowNull: false
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
      verified:{
        type: Sequelize.INTEGER
      },
      toBeVerified:{
        type: Sequelize.INTEGER
      },
      rejected: {
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
    return queryInterface.dropTable('employer_reports');
  }
};
