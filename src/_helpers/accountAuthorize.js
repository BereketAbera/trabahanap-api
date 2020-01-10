const expressJwt = require('express-jwt');
const CONSTANTS = require('../../constants');
module.exports = authorize;

function authorize() {
    return [
        expressJwt({ secret: CONSTANTS.JWTSECRET })
    ];
}