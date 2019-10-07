const Sequelize = require('sequelize');

// const sequelize = new Sequelize("trabahanap_development", "root", '', {host: '127.0.0.1', dialect: 'mysql'});
const sequelize = new Sequelize("postgres://sgnzgxvvvpewrh:0eaf8b06417ff94bad97cbc7d9682d3006169aef5599b86a75883a5fe023c52e@ec2-107-21-126-201.compute-1.amazonaws.com:5432/d4jd8cd85qd8i6")
// sequelize.sync();

module.exports = sequelize;
global.sequelize = sequelize;