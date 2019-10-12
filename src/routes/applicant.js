const app = module.exports = require('express')();
const userController = require('../users/users.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from applicant'})
})

app.post('/profile', userController.createApplicantProfile);