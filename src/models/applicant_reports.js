/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('applicant_reports', {
      datefield: {
        primaryKey: true,
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      googles: {
        type: DataTypes.INTEGER(11)
      },
      facebooks:{
        type: DataTypes.INTEGER(11)
      },
      normals:{
        type: DataTypes.INTEGER(11)
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
      dailyApplications:{
        type: DataTypes.INTEGER(11)
      },
      dailyUniqueApplicants:{
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
      tableName: 'applicant_reports'
    });
  };
  