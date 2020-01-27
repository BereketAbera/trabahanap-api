'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'advertisement',
      'createdAt',
      {
        allowNull: false,
        type: Sequelize.DATE
      }
    ).then(() => {
      return queryInterface.addColumn(
        'advertisement',
        'websiteURL',
        {
          allowNull: true,
          type: Sequelize.STRING
        }
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'advertisement',
      'createdAt'
    ).then(() => {
      return queryInterface.removeColumn(
        'advertisement',
        'websiteURL'
      )
    });
  }
};