'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'locations',
      'caspioId',
      {
        type: Sequelize.STRING,
        defaultValue: null
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'locations',
      'caspioId'
    );
  }
};