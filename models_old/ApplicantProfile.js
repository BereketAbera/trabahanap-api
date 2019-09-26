const Sequelize = require('sequelize');
const User = require('./User');
const Country = require('./Country');
const Region = require('./Region');
const City = require('./City');

const ApplicantProfile = global.sequelize.define("ApplicantProfile", {
    id: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    cv: {
        type: Sequelize.STRING,
    },
    currentEmployer: {
        type: Sequelize.STRING,
    },
    currentOccopation: {
        type: Sequelize.STRING,
    },
    address1: {
        type: Sequelize.STRING,
    },
    address2: {
        type: Sequelize.STRING,
    },
    self_description: {
        type: Sequelize.TEXT,
    },
});

// ApplicantProfile.belongsTo(User)
// User.hasMany(ApplicantProfile);

// ApplicantProfile.belongsTo(Country)
// Country.hasMany(ApplicantProfile);

// ApplicantProfile.belongsTo(Region)
// Region.hasMany(ApplicantProfile);

// ApplicantProfile.belongsTo(City)
// City.hasMany(ApplicantProfile);

module.exports = ApplicantProfile;