const express = require('express');
const bodyParser = require('body-parser');



const PORT = 3000;
// DB connection
require('./src/database/connection');
require('./src/bootstrap')();

const func = async () => {
    const User = require('./models/user')();
    const u = await User.create({username: 'bek', password: 'password', email: 'bek@gmail.com'}).catch(e => console.log(e));
}

func();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})