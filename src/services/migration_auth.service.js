const { User } = require('../models');


function getUserByEmail(email){
    return User.findOne({where: {email}});
}

module.exports = {
    getUserByEmail
}