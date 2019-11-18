require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const hbs = require( 'express-handlebars');
const morgan = require('morgan');

const errorHandler = require('./_helpers/error_handler');
const routes = require('./routes');

const CONSTANTS = require('../constants');
// const fileUpload = require('./_helpers/file_upload');

const PORT = process.env.PORT || 3000;

let app = express();

app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
// view engine setup
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

// var whitelist = ['http://localhost:4200', 'http://192.168.1.105'];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(cors());

app.use(routes);


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})

module.exports = {app};