const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');
const jobsController = require('../controllers/jobs.controller');
const fileUpload = require('../_helpers/file_upload');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from employer'})
})

app.get('/locations/:companyProfileId', locationController.getCompanyLocations);

app.post('/jobs', jobsController.addJob)

app.post('/profile',  userController.createCompanyProfile);

app.put('/profile/:id', userController.editCompanyProfile);

app.post('/location', locationController.addLocation);