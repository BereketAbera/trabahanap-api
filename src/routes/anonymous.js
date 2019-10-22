const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const jobsController = require('../controllers/jobs.controller');

app.get('/jobs', jobsController.getAllJobs);