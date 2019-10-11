const Sequelize = require('sequelize');

// const sequelize = new Sequelize("sql9307713", "sql9307713", 'NyhsxYeSvU', {host: 'sql9.freemysqlhosting.net', dialect: 'mysql'});

const sequelize = new Sequelize("trabahanap_development", "root", "", {host: "localhost", dialect: "mysql", logging: false});

// const sequelize = new Sequelize("postgres://sgnzgxvvvpewrh:0eaf8b06417ff94bad97cbc7d9682d3006169aef5599b86a75883a5fe023c52e@ec2-107-21-126-201.compute-1.amazonaws.com:5432/d4jd8cd85qd8i6")


module.exports = sequelize;
global.sequelize = sequelize;