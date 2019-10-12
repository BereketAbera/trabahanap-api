const app = module.exports = require('express')();

const userController = require('../users/users.controller');

app.post('/applicant_signup', userController.signUpApplicant);

app.post('/employer_signup', userController.signUpEmployer)

app.post('/login', userController.authenticate);

app.get('/email_verification', userController.verifyEmail)

app.get('/logout', (req, res) => {
    res.send({msg: 'Hello'});
});