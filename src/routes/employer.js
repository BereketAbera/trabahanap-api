const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from employer'})
})

app.post('/profile', userController.createCompanyProfile);

app.put('/profile/:id', userController.editCompanyProfile);

app.post('/location', locationController.addLocation);