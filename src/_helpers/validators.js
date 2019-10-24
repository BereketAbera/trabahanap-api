const validator = require('validator');
const _ = require('lodash');

function validateUser(data){
    const errors = {};
    let valid = true;
    const fields = ["email", "username", "phoneNumber", "password", "firstName", "lastName", "gender"];
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

function validateApplicantProfile(data){
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
                errors[key] = `${key} should be a number`;
                valid = false;
            }
        }else if(key == "zipcode"){
            if(!validator.isPostalCode(value + '', 'US')){
                errors[key] = `zipcode is not valid`;
                valid = false;
            }
        }else if(validator.isEmpty(value + '')){
            errors[key] = `${key} is not valid`;
            valid = false;
        }
    })

    if(valid){
        return valid;
    }
    return errors;
}

module.exports = {
    validateUser,
    validateApplicantProfile,
    validateCompanyProfile
}