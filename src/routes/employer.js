const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');
const jobsController = require('../controllers/jobs.controller');

app.get('/locations/:companyProfileId', locationController.getCompanyLocations);
app.post('/location', locationController.addLocationWithImage);

app.post('/jobs/applications', jobsController.getJobApplications);
app.put('/jobs/:id', jobsController.editJob);
app.get('/jobs', jobsController.getAllCompanyJobs);
app.post('/jobs', jobsController.addJob);

app.put('/profile/locations/picture/id', locationController.updateLocationPicture);
app.get('/profile/locations/:id', locationController.getLocation);
app.put('/profile/locations/:id', locationController.updateLocation);
app.post('/profile/logo', userController.updateCompanyLogo);
app.post('/profile/businessLicense', userController.updateCompanyBusinessLicense);
app.put('/profile/:id', userController.editCompanyProfile);
app.post('/profile',  userController.createCompanyProfileWithBusinessLicenseAndLogo);



