'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'jobs',
      'suspended',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'jobs',
      'suspended'
    );
  }
};
