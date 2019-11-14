'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('company_profiles', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      zipcode: {
        type: Sequelize.STRING
      },
      companyName: {
        type: Sequelize.STRING
      },
      contactPerson: {
        type: Sequelize.STRING
      },
      contactNumber: {
        type: Sequelize.STRING
      },
      websiteURL: {
        type: Sequelize.STRING
      },
      industryType: {
        type: Sequelize.STRING
      },
      companyLogo: {
        type: Sequelize.STRING
      },
      companyDescription: {
        type: Sequelize.TEXT
      },
      businessLicense: {
        type: Sequelize.TEXT
      },
      hasLocations:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      businessLicenseNumber: {
        type: Sequelize.STRING
      },
      companyAddress: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('company_profiles');
  }
};