'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'company_profiles',
      'featured',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'company_profiles',
      'featured'
    );
  }
};