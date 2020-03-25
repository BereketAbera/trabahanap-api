"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("advertisement", "orientation", {
      allowNull: true,
      type: Sequelize.STRING,
      defaultValue: "HORIZONTAL"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("advertisement", "orientation");
  }
};
