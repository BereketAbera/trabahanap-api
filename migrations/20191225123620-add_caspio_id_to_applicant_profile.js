'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'applicant_profiles',
      'caspioId',
      {
        type: Sequelize.STRING,
        defaultValue: null
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'applicant_profiles',
      'caspioId'
    );
  }
};