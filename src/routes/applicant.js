const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const jobsController = require('../controllers/jobs.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from applicant'})
})

app.post('/jobs/apply', jobsController.applyJob);
app.get('/jobs/applications', jobsController.getApplicantApplications)
app.get('/jobs/:id', jobsController.getApplicantJob);

app.post('/profile', userController.createApplicantProfileWithCVAndPicture);
app.get('/profile', userController.getApplicantProfile);
app.post('/profile/cv', userController.updateApplicantCV);
app.post('/profile/picture', userController.updateApplicantPicture);
app.put('/profile/:id', userController.editApplicantProfile);
