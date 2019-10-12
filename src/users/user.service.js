require('dotenv').config();
const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const uuidv4 = require('uuid/v4');
const ROLE = require('../_helpers/role');
const constructEmail = require('../_helpers/construct_email');
const _ = require('lodash');

const { User, ApplicantProfile, CompanyProfile } = require('../models');

sgMail.setApiKey(config.sendGridApiKey);


async function authenticate({ email, password }) {
    const user = await User.findOne({ where: {email}, include: [{model: CompanyProfile}]}).catch(e => console.log(e));
    if (user) {
        const pass = bcryptjs.compareSync(password, user.password);
        if(pass){
            const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, { expiresIn: '2h' });
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
    const unique = await isEmailUnique(body);
    if(unique){
        body["role"] = ROLE.APPLICANT;
        const user = await User.create({...body, emailVerificationToken: uuidv4()}).catch(e => console.log(e));
        const message = constructEmail(user);
        sgMail.send(message);
        return user;
    }
    
}

async function signUpEmployer(body){
    const unique = await isEmailUnique(body);
    if(unique){
        body["role"] = ROLE.EMPLOYER;
        const user = await User.create({...body, emailVerificationToken: uuidv4()}).catch(e => console.log(e));
        const message = constructEmail(user);
        sgMail.send(message);
        return user;
    }
   
}

async function createApplicantProfile(body){
    const user = await User.findOne({where: { id: body.user_id, role: ROLE.APPLICANT}}).catch(err => console.log(err));
    if(user){
        const appProfile = await ApplicantProfile.create({...body, UserId: body.user_id}).catch(err => console.log(err));
        if(appProfile){
            return appProfile;
        }
    }
}

async function createCompanyProfile(body){
    const user = await User.findOne({where: { id: body.user_id, role: ROLE.EMPLOYER}}).catch(err => console.log(err));
    if(user){
        const compProfile = await CompanyProfile.create(body).catch(err => console.log(err));
        if(compProfile){
            const updated = await user.update({companyProfileId: compProfile.id});
            if(updated){
                return compProfile;
            }
        }
    }
}

async function verifyEmail(req){
    const user = await User.findOne({where: {emailVerificationToken: req.query.token}}).catch(err => console.log(err));
    if(user){
        const updated = await user.update({ emailVerified: true}).catch(err => console.log(err));
        if(updated){
            return {success: true, message: "Email verifyed successfully.", HOST_URL: process.env.HOST_URL_FRONTEND}
        }
    }

    return { success: false, message: "Cannot varify account.", HOST_URL: process.env.HOST_URL_FRONTEND}
}

// check there aren't registered users with the given email
async function isEmailUnique({ email }){
    const foundEmail = await User.findOne({where: { email }}).catch(e => console.log(e));
    if(foundEmail){
        return false;
    }
    return true;
}


module.exports = {
    authenticate,
    signUpApplicant,
    signUpEmployer,
    verifyEmail,
    createApplicantProfile,
    createCompanyProfile
};