const validator = require('validator');
const _ = require('lodash');

function validateJob(data){
    const errors = {};
    let valid = true;
    const fields = ["jobTitle", "jobDescription", "industry", "educationAttainment", "salaryRange", "employmentType", "vacancies", "applicationStartDate", "applicationEndDate", "locationId"];
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
        if(key == "vacancies" || key == "zipCode" || key == "businessLicense"){
            if(!validator.isNumeric(value + '')){
                errors[key] = `${key} should be a number`;
                valid = false;
            }
        }else if(key == "applicationStartDate" || key == "applicationEndDate"){
            if(!validator.toDate(value + '')){
                errors[key] = `${key} is not valid`;
                valid = false;
            }
        }else if(fields.includes(key) && validator.isEmpty(value + '')){
            errors[key] = `${key} is not valid`;
            valid = false;
        }
    })

    if(valid){
        return valid;
    }

    return errors;
}

function validateUser(data){
    const errors = {};
    let valid = true;
    const fields = ["email", "username", "phoneNumber", "password", "firstName", "lastName"];
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
    const fields = [ "gender", "dateOfBirth", "selfDescription", "CityId", "RegionId", "CountryId"];
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
        if( fields.includes(key) && validator.isEmpty(value+'')){
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
    const fields = ["companyName", "contactPerson", "contactNumber", "industryType", "companyDescription", "businessLicenseNumber", "CityId", "RegionId", "CountryId"];
    const keys = _.keys(data);
    fields.map(field => {
        if(keys.includes(field)){
            return;
        }
        // console.log(field);
        valid = false
    }) 
    if(!valid){
        return "some required fields are not present";
    }

    _.map(data, (value, key) => {
        if((key == "zipCode" && value) || key == "businessLicense"){
            if(!validator.isNumeric(value + '')){
                errors[key] = `${key} should be a number`;
                valid = false;
            }
        }else if(key == "zipcode" && value){
            if(!validator.isPostalCode(value + '', 'US')){
                errors[key] = `zipcode is not valid`;
                valid = false;
            }
        }else if(fields.includes(key) && validator.isEmpty(value + '')){
            errors[key] = `${key} is not valid`;
            valid = false;
        }
    })

    if(valid){
        return valid;
    }
    return errors;
}

function validateLocation(data){
    const errors = {};
    let valid = true;
    const fields = ["locationName", "locationPhoneNumber", "isHeadOffice", "address", "email", "cityId", "regionId", "countryId", "latitude", "longitude"];
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
        if(key == "latitude", key == "longitude"){
            if(!validator.isNumeric(value + '')){
                errors[key] = `${key} should be a number`;
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

function validateIssue(data){
    const errors = {};
    let valid = true;
    const fields = ["issueType", "issueReason", "issueDescription"];
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
        if(fields.includes(key) && validator.isEmpty(value + '')){
            errors[key] = `${key} is not valid`;
            valid = false;
        }
    })

    if(valid){
        return valid;
    }
    return errors;
}

function validateAds(data){
    const errors = {};
    let valid = true;
    const fields = ["title", "adsStart", "adsEnd"];
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
        if(fields.includes(key) && validator.isEmpty(value + '')){
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
    validateCompanyProfile,
    validateLocation,
    validateJob,
    validateIssue,
    validateAds
}
