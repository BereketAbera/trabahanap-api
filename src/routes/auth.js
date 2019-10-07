const app = module.exports = require('express')();

const userController = require('../users/users.controller');

app.post('/signup', (req, res) => {
    res.send('Hello');
//   signup(req.body)
//     .then((user) => res.send({
//       user: omit(user, 'password')
//     }))
//     .catch((err) => {
//       res.status(400).send({msg: 'Signup failed', err});
//     })
//   ;
});


app.post('/login', userController.authenticate);

app.get('/logout', (req, res) => {
    res.send({msg: 'Hello'});
//   logout(req.authKey).then(() => res.send({msg: 'logged out'}));
});