const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');
const jobsController = require('../controllers/jobs.controller');

app.post('/location', locationController.addLocationWithImage);
app.get('/profile/locations/:id', locationController.getLocation);
app.get('/locations/:companyProfileId', locationController.getCompanyLocations);


app.get('/jobs', jobsController.getAllCompanyJobs)
app.post('/jobs', jobsController.addJob)
app.put('/jobs/:id', jobsController.editJob)

app.post('/profile',  userController.createCompanyProfileWithBusinessLicenseAndLogo);

app.put('/profile/:id', userController.editCompanyProfile);

