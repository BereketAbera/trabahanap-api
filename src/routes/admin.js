const app = module.exports = require('express')();
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller')

// app.get('/employers', (req, res) => {
//     res.send({msg: 'list of employers from admin here'})
// })

app.get('/employers',userController.getAllEmployers);
app.post('/employer',userController.admnCreateCompanyProfileWithBusinessLicenseAndLogo);
app.get('/employer_password/:email/:token', userController.addNewEmployerPassword)
app.post('/employer_password/:email/:token', userController.changeEmployerPassword)
