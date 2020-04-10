const environment = require("../environmets/environmet");
const axios = require("axios");

function createUserApi(user) {
  user["APPLICATION"] = "TRABAHANAP";
  return axios.post(`${environment}/auth/signup`, user);
}

function verifyUserFromApi(token) {
  return axios.post(`${environment}/auth/verify_email`, { token });
}

function loginFromApi(user) {
  return axios.post(`${environment}/auth/login`, user);
}
function verifyTokens(token) {
  return axios.post(`${environment}/auth/verify_token`, { token });
}

function getUserByEmailFromApi(email) {
  return axios.get(`${environment}/auth/users/${email}`);
}

function changePassword(user_id, password) {
  return axios.post(`${environment}/auth/change_password`, {
    id: user_id,
    password: password,
    confirmPassword: password
  });
}

function updatePassword(user_id, oldPassword, newPassword) {
  return axios.post(`${environment}/auth/update_password`, {
    id: user_id,
    oldPassword: oldPassword,
    newPassword: newPassword
  });
}

function updateUser(user_id, body) {
  return axios.post(`${environment}/auth/update_user`, {
    id: user_id,
    firstName: body.firstName,
    lastName: body.lastName,
    phoneNumber: body.phoneNumber
  });
}

async function addCompanies(body) {
  return await axios.post(`${environment}/auth/companies`, {
    ...body,
    address: body.companyAddress,
    applicationApplicationId: "TRABAHANAP"
  });
}

module.exports = {
  createUserApi,
  verifyUserFromApi,
  loginFromApi,
  verifyTokens,
  changePassword,
  getUserByEmailFromApi,
  updatePassword,
  updateUser,
  addCompanies
};
