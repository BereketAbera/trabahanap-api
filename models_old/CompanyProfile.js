const Sequelize = require('sequelize');
const User = require('./User');
const Country = require('./Country');
const Region = require('./Region');
const City = require('./City');

const CompanyProfile = global.sequelize.define("CompanyProfile", {
    id: {
        type: Sequelize.INTEGER(20),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    zipcode: {
        type: Sequelize.STRING,
    },
    companyName: {
        type: Sequelize.STRING,
    },
    contactPerson: {
        type: Sequelize.STRING,
    },
    contactNumber: {
        type: Sequelize.STRING,
    },
    websiteURL: {
        type: Sequelize.STRING,
    },
    industryType: {
        type: Sequelize.STRING,
    },
    companyLogo: {
        type: Sequelize.STRING,
    },
    companyDescription: {
        type: Sequelize.TEXT,
    },
    businessLicense: {
        type: Sequelize.STRING,
    },
    businessLicenseNumber: {
        type: Sequelize.INTEGER,
    },
    companyAddress: {
        type: Sequelize.STRING,
    }
});

// CompanyProfile.belongsTo(User)
// User.hasMany(CompanyProfile);

// CompanyProfile.belongsTo(Country)
// Country.hasMany(CompanyProfile);

// CompanyProfile.belongsTo(Region)
// Region.hasMany(CompanyProfile);

// CompanyProfile.belongsTo(City)
// City.hasMany(CompanyProfile);

module.exports = CompanyProfile;