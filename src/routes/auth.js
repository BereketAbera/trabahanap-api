const app = module.exports = require('express')();

const userController = require('../users/users.controller');

app.post('/applicant_signup', userController.signUpApplicant);

app.post('/login', userController.authenticate);

app.get('/logout', (req, res) => {
    res.send({msg: 'Hello'});
});