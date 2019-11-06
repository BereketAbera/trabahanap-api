const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');
const jobsController = require('../controllers/jobs.controller');
const fileUpload = require('../_helpers/file_upload');

app.get('/locations/:companyProfileId', locationController.getCompanyLocations);

app.post('/jobs', jobsController.addJob)
app.get('/jobs', jobsController.getAllCompanyJobs)

app.post('/profile',  userController.createCompanyProfileWithBusinessLicenseAndLogo);

app.put('/profile/:id', userController.editCompanyProfile);

app.post('/location', locationController.addLocationWithImage);