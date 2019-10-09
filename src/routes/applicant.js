const app = module.exports = require('express')();

app.get('/jobs', (req, res) => {
    res.send({msg: 'from applicant'})
})