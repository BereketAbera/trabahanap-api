'use strict';
module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define('Calendar', {
    datefield: DataTypes.DATE
  }, {});
  Calendar.associate = function(models) {
    // associations can be defined here
  };
  return Calendar;
};