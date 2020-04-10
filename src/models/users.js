/* jshint indent: 2 */
const bcryptjs = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  let user = sequelize.define(
    "users",
    {
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
      role: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      lastLoggedIn: {
        type: DataTypes.DATE,
        allowNull: true
      },
      emailVerified: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: "0"
      },
      hasFinishedProfile: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      registeredVia: {
        type: DataTypes.STRING(255)
      },
      dailyLoginCount: {
        type: DataTypes.INTEGER(11)
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      verifiedByEmail: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: "users"
    }
  );

  // user.beforeCreate((u, options) => {
  //   u.password = bcryptjs.hashSync(u.password, 10);
  //   return user;
  // });

  return user;
};
