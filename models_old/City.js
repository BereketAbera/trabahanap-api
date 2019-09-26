const Sequelize = require('sequelize');
const Region = require('./Region');

const City = global.sequelize.define("City", {
    id: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    cityName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    regionName: {
        type: Sequelize.STRING(255),
    }
});

// City.belongsTo(Region, {as: 'region', foreignKey: 'regionId'});
// Region.hasMany(City);


module.exports = City;