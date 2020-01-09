
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
    return await axios.post(`${environment}/auth/verify_token`,{token})
}

async function getUserByEmailFromApi(email){
    return await axios.get(`${environment}/auth/users/${email}`)
}

async function changePassword(user_id,password){
    console.log(password,'password')
    console.log(user_id,'id')
    return await axios.post(`${environment}/auth/change_password`,{id:user_id,password:password,confirmPassword:password})
}


module.exports = {
    createUserApi,
    verifyUserFromApi,
    loginFromApi,
    verifyTokens,
    changePassword,
    getUserByEmailFromApi
};