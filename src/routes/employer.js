const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');
const jobsController = require('../controllers/jobs.controller');
const otherController = require('../controllers/other.controller');

app.get('/locations/:companyProfileId', locationController.getCompanyLocations);
app.post('/location', locationController.addLocationWithImage);

app.get('/jobs/applications', jobsController.getJobWithApplications);
app.post('/jobs/applications/filter', jobsController.filterJobApplication);
app.get('/jobs/filtered/applications', jobsController.getFilteredJobWithApplications);
app.get('/jobs/applications/applicant/:id', jobsController.getJobApplicant);
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

app.post('/staff/add', otherController.addStaff)
app.get('/staff', otherController.getStaffs)



