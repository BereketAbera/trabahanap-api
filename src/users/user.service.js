const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Sequelize = require('sequelize');
const _ = require('lodash');

const User = require('../../models/user')(global.sequelize, Sequelize.DataTypes);
const CompanyProfile = require('../../models/company_profile')(global.sequelize, Sequelize.DataTypes);
User.belongsTo(CompanyProfile);
CompanyProfile.hasMany(User);

async function authenticate({ username, password }) {
    const user = await User.findOne({ where: {username}, include: [{model: CompanyProfile}]}).catch(e => console.log(e));
    if (user) {
        const pass = bcryptjs.compareSync(password, user.password);
        if(pass){
            const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '2h' });
            const userWithoutPassword = {};
            _.map(user.dataValues, (value, key) => {
                if(key == 'password'){
                    userWithoutPassword['token'] = token;
                    return;
                }

                userWithoutPassword[key] = value;
            });
            return userWithoutPassword;
        }
    }
}

async function getAll() {
    // return users.map(u => {
    //     const { password, ...userWithoutPassword } = u;
    //     return userWithoutPassword;
    // });
}

module.exports = {
    authenticate,
    getAll
};