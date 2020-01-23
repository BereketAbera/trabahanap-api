'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('advertisement', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      adsStart: {
        allowNull: false,
        type: Sequelize.DATE
      },
      adsEnd: {
        allowNull: false,
        type: Sequelize.DATE
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      company: {
        type: Sequelize.STRING
      },
      contactPerson: {
        type: Sequelize.STRING
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('advertisement');
  }
};
