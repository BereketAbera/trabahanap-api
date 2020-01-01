const Sequelize = require('sequelize');

// const sequelize = new Sequelize("bk4yqi0gmzcpimxfke0a", "ucwfssjelgcnq7zc", 'UV2XYZi3g7TY3nXPenzL', {host: 'bk4yqi0gmzcpimxfke0a-mysql.services.clever-cloud.com', dialect: 'mysql', logging: false});
// const Op = Sequelize.Op


const sequelize = new Sequelize("trabahanap_development", "root", "", {host: "localhost", dialect: "mysql", logging: false});

// console.log(sequelize);
module.exports = sequelize;
global.sequelize = sequelize;