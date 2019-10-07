'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    role: DataTypes.STRING,
    lastLoggedIn: DataTypes.DATE,
    emailvarified: DataTypes.BOOLEAN
  }, {});

  user.associate = function(models) {
    // user.belongsTo(models.company_profile);
  };

  user.beforeCreate((u, options) => {
    return bcryptjs.hashSync(u.password, 10);
  });
  return user;
};