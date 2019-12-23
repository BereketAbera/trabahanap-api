const expressJwt = require('express-jwt');
// const { secret } = require('../../config.json');

const CONSTANTS = require('../../constants');

module.exports = adminAuthorize;

function adminAuthorize(role) {
    return [
        (req, res, next) => {
            console.log(req.user.role, "the requesting user role");
            if (req.user.role != role) {
                return res.status(200).json({ success: false, error: 'Unauthorized' });
            }
            next();
        }
    ];
}