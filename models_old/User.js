const Sequelize = require('sequelize');

const User = global.sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    gender: {
        type: Sequelize.STRING,
    },
    role: {
        type: Sequelize.STRING,
    },
    lastLoggedIn: {
        type: Sequelize.DATE,
    },
    emailVarified: {
        type: Sequelize.BOOLEAN,
    }
});

module.exports = User;