'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('temp_locations', {
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
      caspioOrgId:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      locationName: {
        type: Sequelize.STRING
      },
      locationPhoneNumber: {
        type: Sequelize.STRING
      },
      isHeadOffice: {
        type: Sequelize.BOOLEAN
      },
      picture:{
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      CityId: {
        type: Sequelize.INTEGER
      }, 
      RegionId: {
        type: Sequelize.INTEGER
      },
      CountryId: {
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
    return queryInterface.dropTable('temp_locations');
  }
};
