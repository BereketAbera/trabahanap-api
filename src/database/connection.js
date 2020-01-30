const Sequelize = require("sequelize");

const sequelize = new Sequelize("trb_mig_temp_2", "root", "password", {
  host: "192.168.0.10",
  dialect: "mysql",
  logging: false
});

//const sequelize = new Sequelize("trabahanap_development", "root", "", {host: "localhost", dialect: "mysql", logging: false,operatorsAliases:1});
// const sequelize = new Sequelize("trb_mig_temp", "root", "password", {host: "192.168.0.10", dialect: "mysql", logging: false,operatorsAliases:1});

module.exports = sequelize;
global.sequelize = sequelize;
