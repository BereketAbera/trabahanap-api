/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lastLoggedIn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '2019-10-08 11:33:47'
    },
    emailvarified: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
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
    tableName: 'users'
  });
};
