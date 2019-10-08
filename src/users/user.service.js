const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Sequelize = require('sequelize');
const _ = require('lodash');

const { User, ApplicantProfile } = require('../models');


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

        return user;
    }
}

async function signUpApplicant(body){
    const unique = await emailUnique(body.userInfo);
    if(unique){
        body.userInfo["role"] = "APPLICANT";
        const user = await User.create(body.userInfo).catch(e => console.log(e));
        const applicantProfile = await ApplicantProfile.create({
            ...body.applicantInfo, 
            "UserId": user.id, 
            CityId: body.applicantInfo.CityId,
            RegionId: body.applicantInfo.RegionId,
            CountryId: body.applicantInfo.CountryId
        }).catch(e => console.log(e));
        const applicant = await ApplicantProfile.findOne({where: { id: applicantProfile.id }, include: [{model: User}]}).catch(e => console.log(e));
        return applicant;
    }
    
}

async function emailUnique({ email }){
    const foundEmail = await User.findOne({where: { email }}).catch(e => console.log(e));
    console.log(foundEmail);
    if(foundEmail){
        return false;
    }
    return true;
}

module.exports = {
    authenticate,
    signUpApplicant
};