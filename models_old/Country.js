const Sequelize = require('sequelize');

const Country = global.sequelize.define("Country", {
    id: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    countryName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    }
});

module.exports = Country;