const expressJwt = require('express-jwt');
const { secret } = require('../../config.json');

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        expressJwt({ secret }),

        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(200).json({ success: false, message: 'Unauthorized' });
            }
            next();
        }
    ];
}