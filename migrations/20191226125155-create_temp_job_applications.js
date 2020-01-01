'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('temp_job_applications', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      caspioId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      caspioUserId:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      caspioJobId:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      caspioLocId:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      caspioOrgId:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      applicationDate: {
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
    return queryInterface.dropTable('temp_job_applications');
  }
};
