/* jshint indent: 2 */
const bcryptjs = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  let user = sequelize.define('users', {
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
    phoneNumber: {
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
    emailVerified: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    hasFinishedProfile:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken:{
      type: DataTypes.STRING,
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
    tableName: 'users'
  });

  user.beforeCreate((u, options) => {
    u.password = bcryptjs.hashSync(u.password, 10);
    return user;
  });

  return user;
};
