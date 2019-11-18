const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const jobsController = require('../controllers/jobs.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from applicant'})
})

app.post('/jobs/apply', jobsController.applyJob);
app.get('/jobs/applications', jobsController.getApplicantApplications)

app.post('/profile', userController.createApplicantProfileWithCV);
app.get('/profile', userController.getApplicantProfile);