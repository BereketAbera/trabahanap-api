const app = module.exports = require('express')();
const otherController = require('../controllers/other.controller');

app.get('/employers', otherController.getEmployers);
app.put('/employers/verify/:id', otherController.verifyEmployer);

app.get('/issues', otherController.getAllIssues);