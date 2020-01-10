'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'jobs',
      'active',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    ).then(() => {
      return queryInterface.addColumn(
        'jobs',
        'userId',
        { 
          type: Sequelize.UUID,
          references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        constraints: false
      }
      )
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'jobs',
      'active'
    ).then(() => {
      return queryInterface.removeColumn(
        'jobs',
        'userId'
      )
    });
  }
};