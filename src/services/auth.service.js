
const environment = require('../environmets/environmet')
const axios = require('axios');

async function createUserApi(user){
    return await axios.post(`${environment}/auth/signup`,user);
}

async function verifyUserFromApi(token){
    return await axios.post(`${environment}/auth/verify_email`,{token})
}

async function loginFromApi(user){
    return await axios.post(`${environment}/auth/login`,user)
}
async function verifyTokens(token){
    console.log(token)
    return await axios.post(`${environment}/auth/verify_token`,{token})
}

module.exports = {
    createUserApi,
    verifyUserFromApi,
    loginFromApi,
    verifyTokens
};