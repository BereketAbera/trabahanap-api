const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const jobsController = require('../controllers/jobs.controller');
const locationsController = require('../controllers/locations.controller')
const otherController = require('../controllers/other.controller');

app.get('/jobs/:id', jobsController.getJob);
app.get('/jobs', jobsController.getAllJobs);


app.get('/location/cities', locationsController.getAllCities);

app.get('/location/regions', locationsController.getAllRegions);

app.get('/location/countries', locationsController.getAllCountries);

app.get('/location/cities/:regionId', locationsController.getRegionCities);


app.get('/other/industries', otherController.getAllIndustries);

app.get('/search',jobsController.searchByCity);
app.get('/cities',jobsController.searchCities);
app.get('/search/location',jobsController.searchByLocation);
app.get('/search/industry',otherController.searchIndustry);
app.get('/search/advanced',otherController.advancedSearchJob);
