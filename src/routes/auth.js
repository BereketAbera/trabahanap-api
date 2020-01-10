const app = module.exports = require('express')();

const userController = require('../controllers/users.controller');
const accountAuthorize = require('../_helpers/accountAuthorize')

app.post('/applicant_signup', userController.signUpApplicant);

app.post('/employer_signup', userController.signUpEmployer)

app.post('/login', userController.authenticate);

app.get('/email_verification', userController.verifyEmail)

// app.get('/new_staffer/:email/:token', userController.s)
// app.post('/new_staffer/:email/:token', userController.changeUserPassword)

// app.get('/new_applicant/:email/:token', otherController.addNewApplicant)
// app.post('/new_applicant/:email/:token', otherController.changeApplicantPassword)

// app.get('/employer_password/:email/:token', userController.addNewEmployerPassword)
// app.post('/employer_password/:email/:token', userController.changeEmployerPassword)

app.post('/forgot_password',userController.forgetPassword);
app.get('/reset_password/:email/:token',userController.resetPasswordFromEmail)
app.post('/reset_password/:email/:token',userController.changeUserPassword);
app.post('/change_password',accountAuthorize(),userController.changePassword);

app.get('/logout', (req, res) => {
    res.send({msg: 'Hello'});
});
