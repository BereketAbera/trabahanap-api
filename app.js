const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');



const PORT = 3000;
// DB connection
require('./src/database/connection');
require('./src/bootstrap')();

const user = require('./models/user')(global.sequelize, Sequelize.DataTypes);

const func = async () => {

    var u = await user.create({username: 'bek', password: 'password', email: 'bek@gmail.com'}).catch(e => console.log(e));
    console.log(u);
}

func();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})