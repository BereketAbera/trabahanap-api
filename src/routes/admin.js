const app = module.exports = require('express')();
const otherController = require('../controllers/other.controller');
const userController = require('../controllers/users.controller');

app.get('/employers', otherController.getEmployers);
app.post('/employers',userController.admnCreateCompanyProfileWithBusinessLicenseAndLogo);
app.put('/employers/verify/:id', otherController.verifyEmployer);

app.get('/issues', otherController.getAllIssues);
app.post('/issue_responses', otherController.addIssueResponse);

app.post('/applicants', userController.createApplicant)
app.get('/applicants', userController.getApplicants)
