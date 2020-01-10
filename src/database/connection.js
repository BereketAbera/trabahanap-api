const Sequelize = require('sequelize');

// const sequelize = new Sequelize("bk4yqi0gmzcpimxfke0a", "ucwfssjelgcnq7zc", 'UV2XYZi3g7TY3nXPenzL', {host: 'bk4yqi0gmzcpimxfke0a-mysql.services.clever-cloud.com', dialect: 'mysql', logging: false});
// const Op = Sequelize.Op

// const sequelize = new Sequelize("trabahanap_development", "root", "", {host: "localhost", dialect: "mysql", logging: false,operatorsAliases:1});
const sequelize = new Sequelize("trabahanap_migration", "root", "password", {host: "192.168.0.10", dialect: "mysql", logging: false,operatorsAliases:1});

// console.log(sequelize);
module.exports = sequelize;
global.sequelize = sequelize;