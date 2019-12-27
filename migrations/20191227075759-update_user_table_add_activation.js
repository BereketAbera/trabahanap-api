'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'active',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    ).then(() => {
      return queryInterface.addColumn(
        'users',
        'deletedAt',
        {
          allowNull: true,
          type: Sequelize.DATE
        }
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'active'
    ).then(() => {
      return queryInterface.removeColumn(
        'users',
        'deletedAt'
      )
    });
  }
};