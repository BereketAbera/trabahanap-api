const Sequelize = require('sequelize');

const sequelize = new Sequelize("trabahanap_migration", "root", 'password', {host: '192.168.0.10', dialect: 'mysql', logging: false});

// const sequelize = new Sequelize("JobSearch", "Tilahun", "yTTuy8881FGGyZKHWpp2", {host: "live-inc.cn59qlizobae.us-west-2.rds.amazonaws.com", dialect: "mysql", logging: false});

module.exports = sequelize;
global.sequelize = sequelize;
