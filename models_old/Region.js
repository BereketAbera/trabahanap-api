const Sequelize = require('sequelize');
const Country = require('./Country');

const Region = global.sequelize.define("Region", {
    id: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    regionName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    }
});

// Region.belongsTo(Country, {as: 'country', foreignKey: 'countryId'});
// Country.hasMany(Region);



module.exports = Region;