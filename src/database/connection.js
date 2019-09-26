const Sequelize = require('sequelize');

const sequelize = new Sequelize("trabahanap_development", "root", '', {host: '127.0.0.1', dialect: 'mysql'});

// sequelize.sync();

module.exports = sequelize;
global.sequelize = sequelize;