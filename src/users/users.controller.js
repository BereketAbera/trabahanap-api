const express = require('express');
const validator = require('validator');
const userService = require('./user.service');
const _ = require('lodash');

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.status(200).json({success: true, user}) : res.status(200).json({ success: false, message: 'username or password is incorrect' }))
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
    const valid = validateApplicant(req.body);
}

function verifyEmail(req, res, next){
    userService.verifyEmail(req)
        .then(response => res.render('emailVerification', {layout: 'main', response}))
        .catch(err => next(err));
}

function validateUser(data){
    const errors = {};
    let valid = true;
    const fields = ["email", "username", "password", "firstName", "lastName", "gender"];
    const keys = _.keys(data);
    fields.map(field => {
        if(keys.includes(field)){
            return;
        }
        valid = false
    }) 
    if(!valid){
        return "some required fields are not present";
    }
    _.map(data, (value, key) => {
        if(key == 'email'){
            if(!validator.isEmail(value+'')){
                errors[key] = "email is not valid";
                valid = false;
            }
        }else{
            if(validator.isEmpty(value+'')){
                errors[key] = `${key} is required`;
            }
        }
    })

    if(valid){
        return valid;
    }

    return errors;
}

function validateApplicant(data){
    const errors = {};
    let valid = true;
    const fields = ["currentEmployer", "currentOccopation", "address1", "address2", "selfDescription", "CityId", "RegionId", "CountryId"];
    const keys = _.keys(data);
    fields.map(field => {
        if(keys.includes(field)){
            return;
        }
        valid = false
    }) 
    if(!valid){
        return "some required fields are not present";
    }
    
    _.map(data, (value, key) => {
        if(validator.isEmpty(value+'')){
            errors[key] = `${key} is not valid`;
            valid = false;
        }
    })
    
    if(valid){
        return valid;
    }
    return errors;
}

function validateCompanyProfile(data){
    const errors = {};
    let valid = true;
    const fields = ["zipcode", "companyName", "contactPerson", "contactNumber", "websitURL", "industryType", "companyDescription", "businessLicense", "companyAddress", "CityId", "RegionId", "CountryId"];
    const keys = _.keys(data);
    fields.map(field => {
        if(keys.includes(field)){
            return;
        }
        valid = false
    }) 
    if(!valid){
        return "some required fields are not present";
    }

    _.map(data, (value, key) => {
        if(key == "contactNumber" || key == "zipCode" || key == "businessLicense"){
            if(!validator.isNumeric(value + '')){
                obj[key] = `${key} should be a number`;
                valid = false;
            }
        }else if(key == "zipcode"){
            if(!validator.isPostalCode(value + '', 'US')){
                obj[key] = `zipcode is not valid`;
                valid = false;
            }
        }else if(validator.isEmpty(value + '')){
            obj[key] = `${key} is not valid`;
            valid = false;
        }
    })

    if(valid){
        return valid;
    }
    return errors;
}

module.exports = {
    authenticate,
    signUpApplicant,
    signUpEmployer,
    verifyEmail
}