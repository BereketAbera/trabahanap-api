const app = module.exports = require('express')();
const otherController = require('../controllers/other.controller');
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller')
const jobsController = require('../controllers/jobs.controller')

app.get('/employers', otherController.getEmployers);
app.post('/employer',userController.admnCreateCompanyProfileWithBusinessLicenseAndLogo);
app.put('/employers/verify/:id', otherController.verifyEmployer);

app.get('/issues', otherController.getAllIssues);
app.post('/issue_responses', otherController.addIssueResponse);

app.post('/applicants', userController.createApplicant)
app.get('/applicants', userController.getApplicants)

app.post('/location', locationController.addLocationWithImage);
app.post('/jobs', jobsController.addJob);



