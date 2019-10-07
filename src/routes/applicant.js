const app = module.exports = require('express')();


app.post('/jobs', (req, res) => {
    res.send({msg: 'Hello'});
});