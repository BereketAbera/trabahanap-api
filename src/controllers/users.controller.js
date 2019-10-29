require('dotenv').config();
const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const uuidv4 = require('uuid/v4');
const ROLE = require('../_helpers/role');
const constructEmail = require('../_helpers/construct_email');
const _ = require('lodash');
const userService = require('../services/user.service');

sgMail.setApiKey(config.sendGridApiKey);


const {
    validateUser,
    validateApplicantProfile,
    validateCompanyProfile
} = require('../_helpers/validators');

function authenticate(req, res, next) {
    authenticateUsers(req.body)
        .then(user => user ? res.status(200).json({success: true, user}) : res.status(200).json({ success: false, error: 'username or password is incorrect' }))
        .catch(err => next(err));
}

function signUpApplicant(req, res, next){
    const valid = validateUser(req.body);
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    signUpUserApplicant(req.body)
        .then(applicant => applicant ? res.status(200).json({success: true, applicant}) : res.status(200).json({ success: false, error: 'email is not unique'}))
        .catch(err => next(err));

}

function signUpEmployer(req, res, next){
    const valid = validateUser(req.body);
    
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    signUpUserEmployer(req.body)
        .then(employer => employer ? res.status(200).json({success: true, employer}) : res.status(200).json({ success: false, error: 'email is not unique'}))
        .catch(err => next(err));
}

function createApplicantProfile(req, res, next){
    const valid = validateApplicantProfile(req.body);

    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    createUserApplicantProfile({...req.body, user_id: req.user.sub})
        .then(applicantProfile => applicantProfile ? res.status(200).json({success: true, applicantProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function createCompanyProfile(req, res, next){
    const valid = validateCompanyProfile(req.body);

    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    createUserCompanyProfile({...req.body, user_id: req.user.sub})
        .then(companyProfile => companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function verifyEmail(req, res, next){
    verifyUserEmail(req)
        .then(response => res.render('emailVerification', {layout: 'main', response}))
        .catch(err => next(err));
}

async function authenticateUsers({ email, password }) {
    const user = await userService.getUserByEmail(email);
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

async function signUpUserApplicant(body){
    const unique = await isEmailUnique(body);
    if(unique){
        body["role"] = ROLE.APPLICANT;
        const user = await userService.createUser({...body, emailVerificationToken: uuidv4()});
        return user;
    }
    
}

async function signUpUserEmployer(body){
    const unique = await isEmailUnique(body);
    if(unique){
        body["role"] = ROLE.EMPLOYER;
        const user = await userService.createUser({...body, emailVerificationToken: uuidv4()});
        // const message = constructEmail(user);
        // sgMail.send(message);
        return user;
    }
   
}

async function createUserApplicantProfile(body){
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.APPLICANT);
    if(user){
        const appProfile = await userService.addApplicantProfile({...body, UserId: body.user_id});
        if(appProfile){
            return appProfile;
        }
    }
}

async function createUserCompanyProfile(body){
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    if(user){
        const compProfile = await userService.addCompanyProfile(body);
        if(compProfile){
            const updated = await userService.updateUserById(user.id, {companyProfileId: compProfile.id});;
            if(updated){
                return await userService.getUserById(updated.id);
            }
        }
    }
}

async function verifyUserEmail(req){
    const user = await userService.getUserByEmailToken(req.query.emailVerificationToken);
    if(user){
        const updated = await userService.updateUserById(user.id, {emailVerified: true});
        if(updated){
            return {success: true, message: "Email verifyed successfully.", HOST_URL: process.env.HOST_URL_FRONTEND}
        }
    }

    return { success: false, message: "Cannot varify account.", HOST_URL: process.env.HOST_URL_FRONTEND}
}

async function isEmailUnique({ email }){
    const foundEmail = await userService.getUserByEmail(email);
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
}