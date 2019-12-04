const expressJwt = require('express-jwt');
// const { secret } = require('../../config.json');

const CONSTANTS = require('../../constants');

module.exports = empAutorize;

function empAutorize(role) {
    return [
        (req, res, next) => {
            if (req.user.role != role) {
                return res.status(200).json({ success: false, error: 'Unauthorized' });
            }
            next();
        }
    ];
}