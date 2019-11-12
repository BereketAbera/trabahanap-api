const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const jobsController = require('../controllers/jobs.controller');
const locationsController = require('../controllers/locations.controller')

app.get('/jobs/:id', jobsController.getJob);
app.get('/jobs', jobsController.getAllJobs);


app.get('/location/cities', locationsController.getAllCities);

app.get('/location/regions', locationsController.getAllRegions);

app.get('/location/countries', locationsController.getAllCountries);

app.get('/location/cities/:regionId', locationsController.getRegionCities);
