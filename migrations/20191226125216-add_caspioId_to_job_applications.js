'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'job_applications',
      'caspioId',
      {
        type: Sequelize.STRING,
        defaultValue: null
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'job_applications',
      'caspioId'
    );
  }
};