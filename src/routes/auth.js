const app = module.exports = require('express')();

const userController = require('../controllers/users.controller');
const otherController = require('../controllers/other.controller');

app.post('/applicant_signup', userController.signUpApplicant);

app.post('/employer_signup', userController.signUpEmployer)

app.post('/login', userController.authenticate);

app.get('/new_staffer/:email/:token', otherController.addNewStaffer)

app.get('/email_verification', userController.verifyEmail)

app.post('/new_staffer/:email/:token', otherController.changeStafferPassword)

app.get('/employer_password/:email/:token', userController.addNewEmployerPassword)
app.post('/employer_password/:email/:token', userController.changeEmployerPassword)


app.get('/logout', (req, res) => {
    res.send({msg: 'Hello'});
});