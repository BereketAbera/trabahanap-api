const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');
const jobsController = require('../controllers/jobs.controller');
const otherController = require('../controllers/other.controller');
const empAutorize = require('../_helpers/empAutorize');
const ROLE = require('../_helpers/role');

app.get('/counters', otherController.getEmployerDashboardCounts);
app.get('/locations/:companyProfileId', locationController.getCompanyLocations);
app.post('/location', locationController.addLocationWithImage);

app.get('/jobs/applications', jobsController.getJobWithApplications);
app.post('/jobs/applications/filter', jobsController.filterJobApplication);
app.post('/jobs/applications/hire', jobsController.hireJobApplication);
app.get('/jobs/filtered/applications', jobsController.getFilteredJobWithApplications);
app.get('/jobs/applications/applicant/:id', jobsController.getJobApplicant);
app.get('/jobs/applications/applicant/hired/:id/:jobId', jobsController.isHired);
app.get('/jobs/applicants/:id', jobsController.getJobApplicants);
app.get('/jobs/filtered/applicants/:id', jobsController.getFilteredJobApplicants);
app.put('/jobs/:id', jobsController.editJob);
app.get('/jobs', jobsController.getAllCompanyJobs);
app.post('/jobs', jobsController.addJob);

app.put('/profile/locations/picture/:id', locationController.updateLocationPicture);
app.get('/profile/locations/:id', locationController.getLocation);
app.put('/profile/locations/:id', locationController.updateLocation);
app.post('/profile/logo', userController.updateCompanyLogo);
app.post('/profile/businessLicense', userController.updateCompanyBusinessLicense);
app.put('/profile/:id', userController.editCompanyProfile);
app.post('/profile',  userController.createCompanyProfileWithBusinessLicenseAndLogo);

app.post('/staff/add', empAutorize(ROLE.EMPLOYER), otherController.addStaff)
app.get('/staff', empAutorize(ROLE.EMPLOYER), otherController.getStaffs)

app.get('/issues', otherController.getEmpIssues);
app.get('/issues/:id', otherController.getEmpIssueById);
app.post('/issues', otherController.addEmpIssue);
app.delete('/issue/:id', otherController.deleteEmpIssue);

app.get('/applications',jobsController.getCompanyApplications);
app.get('/filter/applications',jobsController.getFilterCompanyApplications);
app.get('/filter/jobs/applications',jobsController.filterJobsApplications);
app.get('/filter/filtered/applications',jobsController.filterAllFilteredJobsApplications);