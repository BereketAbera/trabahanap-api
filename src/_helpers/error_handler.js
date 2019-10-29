module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(200).json({ success: false, message: err });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(200).json({ success: false, message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(200).json({ success: false, message: err.message });
}