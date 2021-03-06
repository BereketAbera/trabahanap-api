/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('locations', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    locationName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    locationPhoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    picture:{
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isHeadOffice: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'locations'
  });
};
