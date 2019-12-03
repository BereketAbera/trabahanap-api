require('dotenv').config();
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
const _ = require('lodash');
// var credentials = {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// };
var credentials = new AWS.SharedIniFileCredentials({ profile: 'liguam' });
AWS.config.credentials = credentials;
// Set the region 
AWS.config.update({ region: 'us-west-2' });
// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const uuidv4 = require('uuid/v4');
const ROLE = require('../_helpers/role');
const constructEmail = require('../_helpers/construct_email');
const userService = require('../services/user.service');
const jobService = require('../services/job.service');
const formidable = require('formidable');
const CONSTANTS = require('../../constants.js');

sgMail.setApiKey(CONSTANTS.SENDGRID_KEY);


const {
    validateUser,
    validateApplicantProfile,
    validateCompanyProfile
} = require('../_helpers/validators');

function authenticate(req, res, next) {
    authenticateUsers(req.body)
        .then(user => {
            if(user && user.error){
                res.status(200).json({success: false, error: user.error});
                return;
            }
            user ? res.status(200).json({success: true, user}) : res.status(200).json({ success: false, error: 'username or password is incorrect' })
        })
        .catch(err => next(err));
}

function signUpApplicant(req, res, next){
    const valid = validateUser(req.body);
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    req.body.username = req.body.email;

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

    req.body.username = req.body.email;

    signUpUserEmployer(req.body)
        .then(employer => employer ? res.status(200).json({success: true, employer}) : res.status(200).json({ success: false, error: 'email is not unique'}))
        .catch(err => next(err));
}

function createCompanyProfileWithBusinessLicenseAndLogo(req, res, next){

    var fileNameLogo = "";
    var fileNameBusinessLisence = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;
    

    form.on('fileBegin', function (name, file){
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        if(name=="companyLogo"){
            fileName = fileNameLogo = Date.now() + "company-logo";
        }else{
            fileName = fileNameBusinessLisence = Date.now() + "company-business-license"; 
        }
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        let companyProfile = {};
        _.map(fields, (value, key) => {
            companyProfile[key] = value;
        })
        companyProfile = {...companyProfile, CityId: companyProfile.cityId, RegionId: companyProfile.regionId, CountryId: companyProfile.countryId};
        const valid = validateCompanyProfile(companyProfile);
        if(valid != true){
            res.status(200).json({success: false, validationError: valid});
            return;
        }
        var fileLogo = files["companyLogo"];
        var fileLicense = files["businessLicense"];
        if(fileLogo && fileLicense && fileLogo.path && fileLicense.path){
            uploadFilePromise(fileLogo.path, 'th-employer-logo', fileNameLogo)
                .then(data => {
                    companyProfile["companyLogo"] = data.Location;
                    return uploadFilePromise(fileLicense.path, 'th-employer-license', fileNameBusinessLisence);
                })
                .then(data => {
                    companyProfile["businessLicense"] = data.Location;
                    return createUserCompanyProfile({...companyProfile, user_id: req.user.sub});
                })
                .then(companyProfile => {
                    fs.unlinkSync(fileLogo.path);
                    fs.unlinkSync(fileLicense.path);
                    companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }else{
            res.status(200).json({success: false});
        }
    });
}

function updateCompanyLogo(req, res, next){
    var fileNameLogo = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file){
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileNameLogo = Date.now() + "company-logo";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var companyLogo = files['companyLogo'];
        if(companyLogo && companyLogo.path){
            uploadFilePromise(companyLogo.path, 'th-employer-logo', fileNameLogo)
                .then(data => {
                    return updateCompanyField(data.Location, "companyLogo", req.user.sub);
                })
                .then(companyProfile => {
                    fs.unlinkSync(companyLogo.path);
                    companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }else{
            res.status(200).json({success: false});
        }

    });
}

function updateCompanyBusinessLicense(req, res, next){
    var fileBusinessLicense = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file){
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileBusinessLicense = Date.now() + "company-business-license";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var businessLicense = files['businessLicense'];
        if(businessLicense && businessLicense.path){
            uploadFilePromise(businessLicense.path, 'th-employer-license', fileBusinessLicense)
                .then(data => {
                    return updateCompanyField(data.Location, "businessLicense", req.user.sub);
                })
                .then(companyProfile => {
                    fs.unlinkSync(businessLicense.path);
                    companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }else{
            res.status(200).json({success: false});
        }

    });
}

function updateApplicantCV(req, res, next){
    var fileNameCV = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file){
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileNameCV = Date.now() + "applicant-cv";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var applicantCV = files['cv'];
        if(applicantCV && applicantCV.path){
            uploadFilePromise(applicantCV.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    return updateApplicantField(data.Location, "cv", req.user.sub);
                })
                .then(applicantProfile => {
                    fs.unlinkSync(applicantCV.path);
                    applicantProfile ? res.status(200).json({success: true, applicantProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }else{
            res.status(200).json({success: false});
        }

    });
}

function updateApplicantPicture(req, res, next){
    console.log(req);
    var fileNameApplicantPicture = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file){
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileNameApplicantPicture = Date.now() + "applicant-picture";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var applicantPicture = files['applicantPicture'];
        console.log("console.log");
        if(applicantPicture && applicantPicture.path){
            uploadFilePromise(applicantPicture.path, 'th-employer-logo', fileNameApplicantPicture)
                .then(data => {
                    return updateApplicantField(data.Location, "applicantPicture", req.user.sub);
                })
                .then(applicantProfile => {
                    fs.unlinkSync(applicantPicture.path);
                    applicantProfile ? res.status(200).json({success: true, applicantProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }else{
            res.status(200).json({success: false});
        }

    });
}

function editApplicantProfile(req, res, next){
    const valid = validateApplicantProfile(req.body);
    
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    const { body } = req;

    editUserApplicantProfile({...body, user_id: req.user.sub, cityId: body.CityId, regionId: body.RegionId, countryId: body.CountryId}, req.params.id)
        .then(applicant => applicant ? res.status(200).json({success: true, applicant}) : res.status(200).json({ success: false, error: 'something went wrong'}))
        .catch(err => next(err));
}

function createApplicantProfileWithCVAndPicture(req, res, next){
    var fileNameCV = "";
    var fileNameProfilePicture = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file){
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        if(name=="cv"){
            fileName = fileNameCV = Date.now() + "applicant-cv";
        }else{
            fileName = fileNameProfilePicture = Date.now() + "applicant-profile"; 
        }

        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        let applicantProfile = {};
        _.map(fields, (value, key) => {
            applicantProfile[key] = value;
        })

        applicantProfile = {...applicantProfile, UserId: req.user.sub};
        const valid = validateApplicantProfile(applicantProfile);

        if(valid != true){
            res.status(200).json({success: false, validationError: valid});
            return;
        }

        var cvFile = files['cv'];
        var profilePictureFile = files['applicantPicture']
        if(cvFile && profilePictureFile){
            uploadFilePromise(cvFile.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    applicantProfile['cv'] = data.Location;
                    return uploadFilePromise(profilePictureFile.path, 'th-employer-logo', fileNameProfilePicture)
                })
                .then(data => {
                    applicantProfile['applicantPicture'] = data.Location;
                    return createUserApplicantProfile(applicantProfile);
                })
                .then(applicantProfile => {
                    fs.unlinkSync(cvFile.path);
                    applicantProfile ? res.status(200).json({success: true, applicantProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }

    });
}

function getApplicantProfile(req, res, next){
    getUserApplicantProfile(req.user.sub)
        .then(applicantProfile => {
            if(applicantProfile){
                res.status(200).json({success: true, applicantProfile})
            }else{
                res.status(200).json({success: true, applicantProfile: null})
            }
        })
        .catch(err => next(err));
}

function verifyEmail(req, res, next){
    verifyUserEmail(req)
        .then(response => res.render('emailVerification', {layout: 'main', response}))
        .catch(err => next(err));
}

function editCompanyProfile(req, res, next){
    const valid = validateCompanyProfile(req.body);

    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    editUserCompanyProfile({...req.body, user_id: req.user.sub}, req.params.id)
        .then(companyProfile => companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}


async function authenticateUsers({ email, password }) {
    const user = await userService.getUserByEmail(email);
    if (user) {
        const pass = bcryptjs.compareSync(password, user.password);
        if(pass){

            if(!user.emailVerified){
                return {error: "Verify you email first"}
            }
            const token = jwt.sign({ sub: user.id, role: user.role }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
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

async function signUpUserApplicant(body){
    const unique = await isEmailUnique(body);
    if(unique){
        body["role"] = ROLE.APPLICANT;
        const user = await userService.createUser({...body, emailVerificationToken: uuidv4()});
        const message = constructEmail(user);
        sgMail.send(message);
        return user;
    }
    
}

async function signUpUserEmployer(body){
    const unique = await isEmailUnique(body);
    if(unique){
        body["role"] = ROLE.EMPLOYER;
        const user = await userService.createUser({...body, emailVerificationToken: uuidv4()});
        const message = constructEmail(user);
        sgMail.send(message);
        return user;
    }
}

async function editUserApplicantProfile(body, id){
    body = {...body, cityId: body.CityId, countryId: body.countryId, regionId: body.regionId};
    // console.log("from edit user applicant profile", body);  
    let applicantProfile = await userService.getApplicantProfileByUserId(body.user_id);
    if(applicantProfile && applicantProfile.id == id){
        const updatedProfile = await userService.updateApplicantProfile(applicantProfile, body);
        if(updatedProfile){
            return updatedProfile;
        }
    }
}

async function updateCompanyField(value, fieldName, userId){
    const user = await userService.getUserById(userId);
    if(user && user.companyProfileId){
        const companyProfile = await userService.updateCompanyField(value, fieldName, user.companyProfileId);
        if(companyProfile[0] && companyProfile[0] > 0){
            const compProfile = await userService.getCompanyProfileById(user.companyProfileId);
            if(compProfile){
                return compProfile;
            }
        }
    }
}

async function updateApplicantField(value, fieldName, userId){
    const applicantProfile = await userService.getApplicantProfileByUserId(userId);

    if(applicantProfile){
        const newApplicantProfile = await userService.updateApplicantProfile(applicantProfile, {[fieldName]: value});
        if(newApplicantProfile){
            return newApplicantProfile;
        }
    }
}

async function createUserApplicantProfile(body){
    const user = await userService.getUserByIdAndRole(body.UserId, ROLE.APPLICANT);
    if(user){
        const appProfile = await userService.addApplicantProfile({...body});
        if(appProfile){
            const newUser = await user.update({hasFinishedProfile: true});
            // if(user)
            if(newUser){
                return newUser;
            }
        }
    }
}

async function getUserApplicantProfile(id){
    let user = await userService.getUserById(id);
    if(user && user.role == "APPLICANT"){
        let applicantProfile = await userService.getApplicantProfileByUserId(user.id);
        if(applicantProfile){
            return applicantProfile;
        }
    }
}

async function createUserCompanyProfile(body){
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    if(user){
        const compProfile = await userService.addCompanyProfile(body);
        if(compProfile){
            const updated = await userService.updateUserById(user.id, {companyProfileId: compProfile.id, hasFinishedProfile: true});
            if(updated){
                return await userService.getUserById(updated.id);
            }
        }
    }
}

async function editUserCompanyProfile(body, id){
    let user = await userService.getUserById(body.user_id);
    if(user){
        if(user.companyProfileId == id){
            let compProfile = await userService.updateCompanyProfileById(id, body);
            if(compProfile){
                let newUser = await userService.getUserById(body.user_id);
                if(newUser){
                    return newUser;
                }
            }
        }
    }
}

async function verifyUserEmail(req){
    const user = await userService.getUserByEmailToken(req.query.token);
    if(user){
        const updated = await userService.updateUserById(user.id, {emailVerified: true});
        if(updated){
            return {success: true, message: "Email verifyed successfully.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND}
        }
    }

    return { success: false, message: "Cannot varify account.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND}
}

async function isEmailUnique({ email }){
    const foundEmail = await userService.getUserByEmail(email);
    if(foundEmail){
        return false;
    }
    return true;
}

function uploadFilePromise(file, bucketName, fileName) {
    var uploadParams = { Bucket: bucketName, Key: fileName, Body: '', ACL: 'public-read' };
    var fileStream = fs.createReadStream(file);
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);
    return new Promise((resolve, reject) => {
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          reject(err)
        } if (data) {
          resolve(data);
        } else {
          reject("system error");
        }
      });
    });
}


module.exports = {
    authenticate,
    signUpApplicant,
    signUpEmployer,
    verifyEmail,
    // createApplicantProfile,
    // createCompanyProfile,
    editCompanyProfile,
    createCompanyProfileWithBusinessLicenseAndLogo,
    getApplicantProfile,
    createApplicantProfileWithCVAndPicture,
    updateCompanyLogo,
    editApplicantProfile,
    updateApplicantCV,
    updateApplicantPicture,
    updateCompanyBusinessLicense
}