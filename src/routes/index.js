const app = module.exports = require('express')();
require('../database/connection');



app.use('/auth', require('./auth'));
app.use('/applicant', require('./applicant'));
// app.use('/employer', require('./employer'));
// app.use('/admin', require('./admin'));
// app.use('/', require('./anonymous'));

// the catch all route
app.all('/*', (req, res) => {
  res.status(404).send({msg: 'not found'});
});