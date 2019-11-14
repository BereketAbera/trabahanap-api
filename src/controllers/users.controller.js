require('dotenv').config();
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
// const _ = require('lodash');
var credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
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
const _ = require('lodash');
const userService = require('../services/user.service');
const formidable = require('formidable');
const CONSTANTS = require('../../constants.js');

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
        if(fileLogo && fileLicense){
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
        fileName = fileNameLogo = Date.now() + "th-employer-logo";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var companyLogo = files['companyLogo'];
        if(companyLogo){
            uploadFilePromise(companyLogo.path, 'th-employer-logo', fileNameLogo)
                .then(data => {
                    return updateCompanyField(data.Location, "companyLogo", req.user.sub);
                })
                .then(companyProfile => {
                    fs.unlinkSync(companyLogo.path);
                    companyProfile ? res.status(200).json({success: true, companyProfile}) : res.status(200).json({sucess: false, error: 'Something went wrong'})
                })
                .catch(err => next(err));
        }

    });
}

function createApplicantProfileWithCV(req, res, next){
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
        if(cvFile){
            uploadFilePromise(cvFile.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    applicantProfile['cv'] = data.Location;
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
        return user;
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
    createApplicantProfileWithCV,
    updateCompanyLogo
}