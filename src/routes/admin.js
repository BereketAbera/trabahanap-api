const app = module.exports = require('express')();
const otherController = require('../controllers/other.controller');
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller')
const jobsController = require('../controllers/jobs.controller')

app.get('/employers', otherController.getEmployers);
app.post('/employers',userController.admnCreateCompanyProfileWithBusinessLicenseAndLogo);
app.put('/employers/verify/:id', otherController.verifyEmployer);

app.get('/issues/applicant', otherController.getApplicantIssuesAdmin);
app.get('/issues/employer', otherController.getCompanyIssuesAdmin);
app.post('/issue_responses', otherController.addIssueResponse);

app.post('/applicants', userController.createApplicant);
app.get('/applicants', userController.getApplicants);

app.post('/location', locationController.addLocationWithImage);
app.post('/jobs/:companyProfileId', jobsController.adminAddJob);
app.put('/jobs/:id', jobsController.editCompanyJob);
app.get('/location/:companyProfileId',locationController.getLocationByCompanyProfile);
app.get('/location/company/:companyProfileId',locationController.getLocatiosForCompany);
app.get('/jobs/:companyProfileId',jobsController.adminGetAllCompanyJob);
app.get('/employers/:companyProfileId',otherController.getCompanyDetails);
app.get('/employers/applicant/:companyProfileId',jobsController.getCompanyApplicant)
app.get('/staff/:companyProfileId',otherController.getStaffsCompany);
app.post('/staff/:companyProfileId',otherController.addStaffsCompany);
app.get('/jobs', jobsController.adminGetAllJobs);