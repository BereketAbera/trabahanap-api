require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("express-handlebars");
const morgan = require("morgan");

const errorHandler = require("./src/_helpers/error_handler");
const routes = require("./src/routes");

// const CONSTANTS = require('../constants');
// const fileUpload = require('./_helpers/file_upload');

// const migrate = require('./migrate-data');
// migrate.migrateData();

const PORT = process.env.PORT || 3000;

let app = express();

app.use(morgan("tiny"));
app.use(express.static(__dirname + "/public"));
// view engine setup
app.engine(".hbs", hbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// var whitelist = ['http://192.168.0.103:4200','localhost:4200'];
var whitelist = ['https://www.trabahanap.com','https://8thaa.com','https://8thbb.com'];
var corsOptions = {
  origin: function (origin, callback) {
    // console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

module.exports = { app };
