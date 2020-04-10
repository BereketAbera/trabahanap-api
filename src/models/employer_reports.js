/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('employer_reports', {
      datefield: {
        primaryKey: true,
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      dailyRegistrations:{
        type: DataTypes.INTEGER(11)
      },
      subTotal:{
        type: DataTypes.INTEGER(11)
      },
      dailyLogins:{
        type: DataTypes.INTEGER(11)
      },
      activeUsers:{
        type: DataTypes.INTEGER(11)
      },
      returningUsers:{
        type: DataTypes.INTEGER(11)
      },
      verified:{
        type: DataTypes.INTEGER(11)
      },
      toBeVerified:{
        type: DataTypes.INTEGER(11)
      },
      rejected: {
        type: DataTypes.INTEGER(11) 
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      tableName: 'employer_reports'
    });
  };
  