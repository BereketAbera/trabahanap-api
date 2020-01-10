'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_and_applicant_profiles', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      caspioId: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastLoggedIn: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      hasFinishedProfile:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      cv: {
        type: Sequelize.STRING
      },
      applicantPicture:{
        type: Sequelize.STRING
      },
      currentEmployer: {
        type: Sequelize.STRING
      },
      currentOccopation: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      dateOfBirth:{
        type: Sequelize.DATE
      },
      selfDescription: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      CityId: {
        type: Sequelize.INTEGER
      }, 
      RegionId: {
        type: Sequelize.INTEGER
      },
      CountryId: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_and_applicant_profiles');
  }
};