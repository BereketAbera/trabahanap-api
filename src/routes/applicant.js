const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const jobsController = require('../controllers/jobs.controller');
const otherController = require('../controllers/other.controller');

// app.get('/jobs', (req, res) => {
//     res.send({msg: 'from applicant'})
// })
app.get('/jobs', jobsController.getApplicantAppliedJobs)
app.get('/jobs/saved', jobsController.getJobsLaterReview);
app.post('/jobs/apply', jobsController.applyJob);
app.post('/jobs/save', jobsController.saveForLaterReview);
app.get('/jobs/applications', jobsController.getApplicantApplications)
app.get('/jobs/:id', jobsController.getApplicantJob);

app.post('/profile', userController.createApplicantProfileWithCVAndPicture);
app.get('/profile', userController.getApplicantProfile);
app.post('/profile/cv', userController.updateApplicantCV);
app.post('/profile/picture', userController.updateApplicantPicture);
app.put('/profile/:id', userController.editApplicantProfile);

app.get('/issues', otherController.getIssues);
app.get('/issues/:id', otherController.getIssue);
app.post('/issues', otherController.addIssue);

app.get('/filter/jobs/saved',jobsController.filterApplicantSavedJobs);
app.get('/filter/jobs/applications',jobsController.filterApplicantAppliedJobs);
app.delete('/issue/:id', otherController.deleteAppIssue);
