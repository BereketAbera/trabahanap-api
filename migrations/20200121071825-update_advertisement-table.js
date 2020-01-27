'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'advertisement',
      'contactPerson',

    ).then(() => {
      return queryInterface.removeColumn(
        'advertisement',
        'company'
      )
    }
    ).then(() => {
      return queryInterface.addColumn(
        'advertisement',
        'userId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          constraints: false
        }

      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'advertisement',
      'contactPerson',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    ).then(() => {
      return queryInterface.addColumn(
        'advertisement',
        'company',
        {
          allowNull: true,
          type: Sequelize.DATE
        }
      )
    }).then(() => {
      return queryInterface.removeColumn(
        'advertisement',
        'userId'
      )
    });
  }
};