const userService = require('../services/user.service');
const _ = require('lodash');
const {
    validateUser,
    validateApplicantProfile,
    validateCompanyProfile
} = require('../_helpers/validators');

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.status(200).json({success: true, user}) : res.status(200).json({ success: false, error: 'username or password is incorrect' }))
        .catch(err => next(err));
}

function signUpApplicant(req, res, next){
    const valid = validateUser(req.body);
    if(valid != true){
        res.status(200).json({success: false, error: valid});
        return;
    }

    userService.signUpApplicant(req.body)
        .then(applicant => applicant ? res.status(200).json({success: true, applicant}) : res.status(200).json({ success: false, error: 'email is not unique'}))
        .catch(err => next(err));

}

function signUpEmployer(req, res, next){
    const valid = validateUser(req.body);
    
    if(valid != true){
        res.status(200).json({success: false, error: valid});
        return;
    }

    userService.signUpEmployer(req.body)
        .then(employer => employer ? res.status(200).json({success: true, employer}) : res.status(200).json({ success: false, error: 'email is not unique'}))
        .catch(err => next(err));
}

function createApplicantProfile(req, res, next){
    const valid = validateApplicantProfile(req.body);

    if(valid != true){
        res.status(200).json({success: false, error: valid});
        return;
    }

    userService.createApplicantProfile({...req.body, user_id: req.user.sub})
        .then(applicantProfile => applicantProfile ? res.status(200).json({success: true, applicantProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function createCompanyProfile(req, res, next){
    const valid = validateCompanyProfile(req.body);

    if(valid != true){
        res.status(200).json({success: false, error: valid});
        return;
    }

    userService.createCompanyProfile({...req.body, user_id: req.user.sub})
        .then(companyProfile => companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function verifyEmail(req, res, next){
    userService.verifyEmail(req)
        .then(response => res.render('emailVerification', {layout: 'main', response}))
        .catch(err => next(err));
}


module.exports = {
    authenticate,
    signUpApplicant,
    signUpEmployer,
    verifyEmail,
    createApplicantProfile,
    createCompanyProfile
}