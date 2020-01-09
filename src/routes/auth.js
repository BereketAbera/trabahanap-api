const app = module.exports = require('express')();

const userController = require('../controllers/users.controller');
const otherController = require('../controllers/other.controller');

app.post('/applicant_signup', userController.signUpApplicant);

app.post('/employer_signup', userController.signUpEmployer)

app.post('/login', userController.authenticate);

app.get('/email_verification', userController.verifyEmail)

app.get('/new_staffer/:email/:token', otherController.addNewStaffer)
app.post('/new_staffer/:email/:token', otherController.changeStafferPassword)

app.get('/new_applicant/:email/:token', otherController.addNewApplicant)
app.post('/new_applicant/:email/:token', otherController.changeApplicantPassword)

app.get('/employer_password/:email/:token', userController.addNewEmployerPassword)
app.post('/employer_password/:email/:token', userController.changeEmployerPassword)

app.post('/facebook/token', userController.facebookAuth);

app.post('/google/token', userController.googleAuth);

    
app.get('/logout', (req, res) => {
    res.send({msg: 'Hello'});
});
