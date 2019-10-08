const express = require('express');
// const router = express.Router();
const validator = require('validator');
const userService = require('./user.service');
const _ = require('lodash');

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.status(200).json({success: true, user}) : res.status(200).json({ success: false, message: 'username or password is incorrect' }))
        .catch(err => next(err));
}

function signUpApplicant(req, res, next){
    const valid = validateApplicant(req.body);
    if(valid != true){
        res.status(200).json({success: false, error: valid});
        return;
    }

    userService.signUpApplicant(req.body)
        .then(applicant => applicant ? res.status(200).json({success: true, applicant}) : res.status(200).json({ success: false, error: 'email is not unique'}))
        .catch(err => next(err));

}

function validateApplicant(applicant){
    const errors = {};
    let valid = true;
    _.map(applicant, (value, key) => {
        var obj = {};
        _.map(value, (v, k) => {
            if(k == "email"){
                if(!validator.isEmail(v)){
                    obj[k] = "email is not valid";
                    valid = false;
                }
            }else if(validator.isEmpty(v + '')){
                obj[k] = `${k} is not valid`;
                valid = false;
            }
        })
        _.isEmpty(obj) ? '' : errors[key] = obj;
    })
    if(valid){
        return true;
    }
    return errors;
}

module.exports = {
    authenticate,
    signUpApplicant
}