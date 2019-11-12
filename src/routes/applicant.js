const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from applicant'})
})

app.post('/profile', userController.createApplicantProfileWithCV);
app.get('/profile', userController.getApplicantProfile);