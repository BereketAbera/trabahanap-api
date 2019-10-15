const app = module.exports = require('express')();
const userController = require('../users/users.controller');
const jobsController = require('../jobs/jobs.controller');

app.get('/jobs', jobsController.getAllJobs);