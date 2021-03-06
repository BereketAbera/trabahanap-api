'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'userApi_id',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'userApi_id'
    )
  }
};