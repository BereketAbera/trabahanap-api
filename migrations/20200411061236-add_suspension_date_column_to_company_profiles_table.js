'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'company_profiles',
      'suspensionDate',
      {
        type: Sequelize.DATE,
        defaultValue: null
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'company_profiles',
      'suspensionDate'
    );
  }
};