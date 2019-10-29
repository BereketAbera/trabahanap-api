const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');

app.get('/jobs', (req, res) => {
    res.send({msg: 'from employer'})
})

app.post('/profile', userController.createCompanyProfile);

app.put('/profile', userController.editCompanyProfile);