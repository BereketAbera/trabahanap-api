const app = module.exports = require('express')();
const userController = require('../users/users.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from employer'})
})

app.post('/profile', userController.createCompanyProfile);