require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const hbs = require( 'express-handlebars');

const errorHandler = require('./_helpers/error_handler');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;


// const user = require('./models/user')(global.sequelize, Sequelize.DataTypes);

let app = express();

app.use(express.static(__dirname + '/public'));
// view engine setup
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})

module.exports = {app};