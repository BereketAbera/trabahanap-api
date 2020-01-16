const migrationAuthService = require('../services/migration_auth.service');
const axios = require('axios');
const environment = require('../environmets/environmet')


function getUserByEmail(req, res, next){
    const email = req.params.email;
    if(!email){
        throw "invalid request";
    }

    getUserByEmailHandler(email)
        .then(user => res.status(200).send({success: true, user}))
        .catch(err => next(err));
}

function validateUser(req, res, next){
    const user = req.body;
    if(!user.email){
        throw "invalid request";
    }

    validateUserHandler(user)
        .then(user => res.status(200).send({success: true, user}))
        .catch(err => next(err));
}


async function getUserByEmailHandler(email){
    const user = migrationAuthService.getUserByEmail(email);

    if(!user){
        throw 'user does not exist';
    }
    let ligUser = await axios.get(`${environment}/auth/user/${email}`);
    ligUser = ligUser.data;
    if(!ligUser || !ligUser.success || !ligUser.user){
        throw 'something went wrong';
    }

    ligUser = ligUser.user;
    if(ligUser.password == null){
        return {
            email: ligUser.email,
            hasPassword: false
        }
    }else{
        return {
            email: ligUser.email,
            hasPassword: true
        }
    }
}

async function validateUserHandler(user){
    const validUser = await migrationAuthService.getUserByEmail(user.email);
    if(!validUser){
        throw 'user does not exist';
    }

    if(validUser.firstName == user.firstName && validUser.lastName && validUser.phoneNumber == user.phoneNumber){
        return {
            email: validUser.email,
            valid: true
        }     
    }else{
        return {
            email: validUser.email,
            valid: false
        }
    }
}


module.exports = {
    getUserByEmail,
    validateUser
}