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
    isHeadOffice: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    address1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING(255),
      allowNull: true
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
