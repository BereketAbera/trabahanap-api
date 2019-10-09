const app = module.exports = require('express')();

app.get('/employers', (req, res) => {
    res.send({msg: 'list of employers from admin'})
})