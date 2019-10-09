const app = module.exports = require('express')();
const ROLE = require('../_helpers/role');
const autorize = require('../_helpers/autorize');
require('../database/connection');



app.use('/auth', require('./auth'));
app.use('/applicant', autorize(ROLE.APPLICANT), require('./applicant'));
app.use('/employer', autorize(ROLE.EMPLOYER), require('./employer'));
app.use('/admin', autorize(ROLE.ADMIN), require('./admin'));
app.use('/', require('./anonymous'));

// the catch all route
app.all('/*', (req, res) => {
  res.status(404).send({msg: 'not found'});
});