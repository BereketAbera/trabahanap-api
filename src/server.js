const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./_helpers/error_handler');
const jwt = require('./_helpers/jwt');


const routes = require('./routes');

const PORT = process.env.PORT || 3000;
// DB connection


// const user = require('./models/user')(global.sequelize, Sequelize.DataTypes);

let app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use(jwt());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})