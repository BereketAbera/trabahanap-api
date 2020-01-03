const expressJwt = require('express-jwt');
// const { secret } = require('../../config.json');
const authService = require('../services/auth.service')

const CONSTANTS = require('../../constants');

module.exports = authorize;




function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        (req, res, next) => {
            verifyToken(req).then(
                data => {
                    if(data.success){
                        req.user = data.user;
                    }
                    console.log(req)
                    if (roles.length && !roles.includes(req.user.role)) {
                        return res.status(200).json({ success: false, error: 'Unauthorized' });
                    }
                    next();
                    console.log(req.user);  
                }
            ).catch(err =>{
                console.log(err)
            });
           
           
          
        }
    ];
}

async function verifyToken(req) {
    const token = req.headers.authorization;
    TokenArray = token.split(" ");
    const verifiedUser = await authService.verifyTokens(TokenArray[1]);
    if (verifiedUser) {
        return verifiedUser.data;
    }
}