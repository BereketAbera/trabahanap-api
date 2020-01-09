require('dotenv').config();
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
const _ = require('lodash');
var credentials = new AWS.SharedIniFileCredentials({ profile: 'liguam' });
AWS.config.credentials = credentials;
// Set the region 
AWS.config.update({ region: 'us-west-2' });
var moment = require('moment');
// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const uuidv4 = require('uuid/v4');
const ROLE = require('../_helpers/role');
const constructEmail = require('../_helpers/construct_email');
const constructApplicantEmail = require('../_helpers/construct_applicant_email');
const construct_employer_email = require('../_helpers/construct_employer_email');
const construct_email_applicant = require('../_helpers/construct_email_applicant');
const construct_reset_password = require('../_helpers/construct_reset_password')
const userService = require('../services/user.service');
const jobService = require('../services/job.service');
const otherService = require('../services/other.service');
const authService = require('../services/auth.service')
const formidable = require('formidable');
const CONSTANTS = require('../../constants.js');
const axios = require('axios');

sgMail.setApiKey(CONSTANTS.SENDGRID_KEY);

const {
    validateUser,
    validateApplicantProfile,
    validateCompanyProfile
} = require('../_helpers/validators');

function authenticate(req, res, next) {
    authenticateUsers(req.body)
        .then(user => {
            if (user && user.error) {
                res.status(200).json({ success: false, error: user.error });
                return;
            }
            user ? res.status(200).json({ success: true, user }) : res.status(200).json({ success: false, error: 'username or password is incorrect' })
        })
        .catch(err => next(err));
}

function getCompanyProfile(req, res, next) {
    getUserById(req.user.sub)
        .then(employer => employer ? res.status(200).json({ success: true, employer }) : res.status(200).json({ success: false, error: 'email is not unique' }))
        .catch(err => next(err));
}

function signUpApplicant(req, res, next) {
    const valid = validateUser(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    req.body.username = req.body.email;

    // axios.post(`${environment}/auth/signup`,req.body).then(user => user ? res.status(200).json({ success: true, user }) : res.status(200).json({ success: false, error: 'email is not unique' }))
    //     .catch(err => next(err));

    signUpUserApplicant(req.body)
        .then(user => user ? res.status(200).json({ success: true, user }) : res.status(200).json({ success: false, error: 'email is not unique' }))
        .catch(err => next(err));

}

function signUpEmployer(req, res, next) {
    const valid = validateUser(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    req.body.username = req.body.email;

    signUpUserEmployer(req.body)
        .then(employer => employer ? res.status(200).json({ success: true, employer }) : res.status(200).json({ success: false, error: 'email is not unique' }))
        .catch(err => next(err));
}


function forgetPassword(req, res, next) {
    resetPassword(req.body)
        .then(response => response ? res.status(200).json({ success: true, response }) : res.status(200).json({ success: false, response: 'No User with this email' }))
        .catch(err => next(err));

}


function admnCreateCompanyProfileWithBusinessLicenseAndLogo(req, res, next) {

    var fileNameLogo = "";
    var fileNameBusinessLisence = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        if (name == "companyLogo") {
            fileName = fileNameLogo = Date.now() + "company-logo";
        } else {
            fileName = fileNameBusinessLisence = Date.now() + "company-business-license";
        }
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        let companyProfile = {};
        _.map(fields, (value, key) => {
            companyProfile[key] = value;
        })

        companyProfile = { ...companyProfile, CityId: companyProfile.cityId, RegionId: companyProfile.regionId, CountryId: companyProfile.countryId };
        const valid = validateCompanyProfile(companyProfile);
        //console.log(companyProfile);

        if (valid != true) {
            res.status(200).json({ success: false, validationError: valid });
            return;
        }
        companyProfile['username'] = companyProfile.email;

        const valid_user = validateUser({ ...companyProfile, password: '1234', username: companyProfile.email });
        if (valid_user != true) {
            res.status(200).json({ success: false, validationError: valid_user });
            return;
        }

        var unique = false;
        isEmailUnique(companyProfile).then(data => {
            unique = data;
            if (unique != true) {
                res.status(200).json({ success: false, Error: "email must be unique" });
                return;
            }
        }).catch(err => next(err));


        var fileLogo = files["companyLogo"];
        var fileLicense = files["businessLicense"];
        if (fileLogo && fileLicense && fileLogo.path && fileLicense.path) {
            uploadFilePromise(fileLogo.path, 'th-employer-logo', fileNameLogo)
                .then(data => {
                    companyProfile["companyLogo"] = data.Location;
                    return uploadFilePromise(fileLicense.path, 'th-employer-license', fileNameBusinessLisence);
                })
                .then(data => {
                    companyProfile["businessLicense"] = data.Location;
                    fs.unlinkSync(fileLogo.path);
                    fs.unlinkSync(fileLicense.path);
                    return adminSignUpEmployerUser(companyProfile);
                })
                .then(data => {
                    //console.log(data)
                    return adminEmployerProfile({ ...companyProfile, user_id: req.user.sub });
                })
                .then(employer => {
                    employer ? res.status(200).json({ success: true, employer }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        } else {
            res.status(200).json({ success: false });
        }
    });
}

async function adminEmployerProfile(body) {
    const user = await userService.getUserByEmail(body.email);
    if (user) {

        const compProfile = await userService.addCompanyProfile({ zipcode, companyName, contactPerson, contactNumber, websiteURL, industryType, companyDescription, companyAddress } = body);
        if (compProfile) {
            const updated = await userService.updateUserById(user.id, { companyProfileId: compProfile.id, hasFinishedProfile: true });
            if (updated) {
                return await userService.getUserById(updated.id);
            }
        }
    }
}

async function adminSignUpEmployerUser(body) {
    const unique = await isEmailUnique(body);
    if (unique) {

        body["role"] = ROLE.EMPLOYER;
        body['emailVerified'] = 1;
        body['hasFinishedProfile'] = true;
        body['password'] = uuidv4();
        body['username'] = body.email;

        const tokenExists = await otherService.getTokenEmail(body.email);
        if (tokenExists) {
            return false;
        }
        const token = uuidv4();
        const saveToken = await otherService.saveToken(token, body.email);
        const { email, username, phoneNumber, password, firstName, lastName, gender, role, emailVerified, hasFinishedProfile } = { ...body };
        const userApi = await authService.createUserApi({email, username, phoneNumber, password, firstName, lastName, gender, role, emailVerified, hasFinishedProfile})
        const user = await userService.createUser({ email, username, phoneNumber, firstName, lastName, gender, role, emailVerified, hasFinishedProfile });

        if (saveToken && user && userApi.data.success) {
            const message = construct_employer_email(body.email, token);
            sgMail.send(message);
            return user;
        }
    }
    else {
        return "Email is not unique"
    }
}

function getAllEmployers(req, res, next) {
    getEmployersWithPagination(req.query.page || 1)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}

function facebookAuth(req, res, next){
    const {access_token, social_id, user} = req.body;
    
    if(!access_token || !social_id || !user){
        return res.status(200).send({ success: false, error: 'invalid request' });
    }

    socialAuthHandler('facebook', access_token, social_id, user)
        .then(user => res.status(200).send({ success: true, user }))
        .catch(err => next(err));
}

function googleAuth(req, res, next){
    const {access_token, social_id, user} = req.body;
    
    if(!access_token || !social_id || !user){
        return res.status(200).send({ success: false, error: 'invalid request' });
    }

    socialAuthHandler('google', access_token, social_id, user)
        .then(user => res.status(200).send({ success: true, user }))
        .catch(err => next(err));
}

async function getEmployersWithPagination(page) {
    const pager = {
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const employers = await userService.getEmployersWithOffsetAndLimit(offset, limit);

    if (employers) {
        pager.totalItems = employers.count;
        pager.totalPages = Math.ceil(employers.count / pager.pageSize);
        return {
            pager,
            rows: employers.rows
        }
    }
}

function changeUserPassword(req, res, next) {
    var response = { ...req.body, error: "", passwordChanged: false, processed: false };
    if (req.body.password.length < 6) {
        response.error = "Password must be at list 6 characters";
        res.render('setNewPassword', { layout: 'main', response });
        return;
    } else if (req.body.password != req.body.comfirm_password) {
        response.error = "Passwords does not much";
        res.render('setNewPassword', { layout: 'main', response });
        return;
    }

    //console.log(response);

    changeNewPassword(req.body, response.token)
        .then(success => {
            response.processed = true;
            if (success) {
                response.passwordChanged = true;
            } else {
                response.passwordChanged = false;
            }

            res.render('setNewPassword', { layout: 'main', response });
            return;
        })
        .catch(err => next(err));
}

async function changeNewPassword(body, token) {
    // console.log(token);
    //const user = await userService.getUserByEmail(body.email);
    console.log(body,'body')
    const userApi = await authService.getUserByEmailFromApi(body.email);
    console.log(userApi.data,'user')
    if (userApi.data.success) {
        // const updatedUser = await userService.updateUserField(bcryptjs.hashSync(body.password, 10), 'password', user.id);
        const updated = await userService.updateUserByEmail(userApi.data.user.email, { emailVerified: true });
        const updateApi = await authService.changePassword(userApi.data.user.id,body.password);
        //const updateToken = await otherService.updateToken(token, { expired: true });
        if (updateApi) {

            return true;
        }
    }
    return false;
}

function resetPasswordFromEmail(req,res,next){
    renderNewUserPassword(req)
        .then(response => res.render('setNewPassword', { layout: 'main', response }))
        .catch(err => next(err));
}

async function renderNewUserPassword(req) {
    if (req.params.token && req.params.token) {
        const exists = await otherService.getToken(req.params.token)
        if (exists) {
            return { ...req.params, verified: true, passwordChanged: false, processed: false }
        }
    }
    return { ...req.params, verified: false, passwordChanged: false, processed: false }
}


async function resetPassword(body) {
    console.log(body)
    if (body.email) {
        const user = await userService.getUserByEmail(body.email);
        const token = uuidv4();
        const saveToken = await otherService.saveToken(token, body.email);
        if (user && saveToken) {
            const message = construct_reset_password(user.firstName,user.email,token);
            sgMail.send(message);
            return "Email sent";
                // return { ...body, token: exists.token, verified: true, passwordChanged: false, processed: false }


            // return { ...req.params, verified: false, passwordChanged: false, processed: false }
        }
        // return "No user with this email address. Register first or Verify your account"
    }

}

function createCompanyProfileWithBusinessLicenseAndLogo(req, res, next) {

    var fileNameLogo = "";
    var fileNameBusinessLisence = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        if (name == "companyLogo") {
            fileName = fileNameLogo = Date.now() + "company-logo";
        } else {
            fileName = fileNameBusinessLisence = Date.now() + "company-business-license";
        }
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        let companyProfile = {};
        _.map(fields, (value, key) => {
            companyProfile[key] = value;
        })

        //companyProfile ={ ...companyProfile }
        companyProfile = { ...companyProfile, CityId: companyProfile.cityId, RegionId: companyProfile.regionId, CountryId: companyProfile.countryId };
        const valid = validateCompanyProfile(companyProfile);
        if (valid != true) {
            res.status(200).json({ success: false, validationError: valid });
            return;
        }

        console.log("no validation")

        var fileLogo = files["companyLogo"];
        var fileLicense = files["businessLicense"];
        if (fileLogo && fileLicense && fileLogo.path && fileLicense.path) {
            uploadFilePromise(fileLogo.path, 'th-employer-logo', fileNameLogo)
                .then(data => {
                    companyProfile["companyLogo"] = data.Location;
                    return uploadFilePromise(fileLicense.path, 'th-employer-license', fileNameBusinessLisence);
                })
                .then(data => {
                    companyProfile["businessLicense"] = data.Location;
                    console.log("lkjds")
                    return createUserCompanyProfile({ ...companyProfile, user_id: req.user.sub });
                })
                .then(companyProfile => {
                    fs.unlinkSync(fileLogo.path);
                    fs.unlinkSync(fileLicense.path);
                    companyProfile ? res.status(200).json({ success: true, companyProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        } else {
            res.status(200).json({ success: false });
        }
    });
}


function updateCompanyLogo(req, res, next) {
    var fileNameLogo = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileNameLogo = Date.now() + "company-logo";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        var companyLogo = files['companyLogo'];
        if (companyLogo && companyLogo.path) {
            uploadFilePromise(companyLogo.path, 'th-employer-logo', fileNameLogo)
                .then(data => {
                    return updateCompanyField(data.Location, "companyLogo", req.user.sub);
                })
                .then(companyProfile => {
                    fs.unlinkSync(companyLogo.path);
                    companyProfile ? res.status(200).json({ success: true, companyProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        } else {
            res.status(200).json({ success: false });
        }

    });
}

function updateCompanyBusinessLicense(req, res, next) {
    var fileBusinessLicense = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileBusinessLicense = Date.now() + "company-business-license";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        var businessLicense = files['businessLicense'];
        if (businessLicense && businessLicense.path) {
            uploadFilePromise(businessLicense.path, 'th-employer-license', fileBusinessLicense)
                .then(data => {
                    return updateCompanyField(data.Location, "businessLicense", req.user.sub);
                })
                .then(companyProfile => {
                    fs.unlinkSync(businessLicense.path);
                    companyProfile ? res.status(200).json({ success: true, companyProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        } else {
            res.status(200).json({ success: false });
        }

    });
}

function updateApplicantCV(req, res, next) {
    var fileNameCV = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileNameCV = Date.now() + "applicant-cv";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var applicantCV = files['cv'];
        if (applicantCV && applicantCV.path) {
            uploadFilePromise(applicantCV.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    return updateApplicantField(data.Location, "cv", req.user.sub);
                })
                .then(applicantProfile => {
                    fs.unlinkSync(applicantCV.path);
                    applicantProfile ? res.status(200).json({ success: true, applicantProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        } else {
            res.status(200).json({ success: false });
        }

    });
}

function updateApplicantPicture(req, res, next) {
    // console.log(req);
    var fileNameApplicantPicture = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        fileName = fileNameApplicantPicture = Date.now() + "applicant-picture";
        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });
    form.parse(req, (err, fields, files) => {
        var applicantPicture = files['applicantPicture'];
        // console.log("console.log");
        if (applicantPicture && applicantPicture.path) {
            uploadFilePromise(applicantPicture.path, 'th-employer-logo', fileNameApplicantPicture)
                .then(data => {
                    return updateApplicantField(data.Location, "applicantPicture", req.user.sub);
                })
                .then(applicantProfile => {
                    fs.unlinkSync(applicantPicture.path);
                    applicantProfile ? res.status(200).json({ success: true, applicantProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        } else {
            res.status(200).json({ success: false });
        }

    });
}

function editApplicantProfile(req, res, next) {
    const valid = validateApplicantProfile(req.body);

    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    const { body } = req;

    editUserApplicantProfile({ ...body, user_id: req.user.sub, cityId: body.CityId, regionId: body.RegionId, countryId: body.CountryId }, req.params.id)
        .then(applicant => applicant ? res.status(200).json({ success: true, applicant }) : res.status(200).json({ success: false, error: 'something went wrong' }))
        .catch(err => next(err));
}

function createApplicantProfileWithCVAndPicture(req, res, next) {
    var fileNameCV = "";
    var fileNameProfilePicture = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;
    //console.log('here')
    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        if (name == "cv") {
            fileName = fileNameCV = Date.now() + "applicant-cv";
        } else {
            fileName = fileNameProfilePicture = Date.now() + "applicant-profile";
        }

        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        let applicantProfile = {};
        _.map(fields, (value, key) => {
            applicantProfile[key] = value;
        })

        applicantProfile = { ...applicantProfile, UserId: req.user.sub };
        const valid = validateApplicantProfile(applicantProfile);

        if (valid != true) {
            res.status(200).json({ success: false, validationError: valid });
            return;
        }

        //console.log('after')

        var cvFile = files['cv'];
        var profilePictureFile = files['applicantPicture']
        if (cvFile) {
            uploadFilePromise(cvFile.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    console.log(data)
                    applicantProfile['cv'] = data.Location;
                    if (profilePictureFile) {
                        return uploadFilePromise(profilePictureFile.path, 'th-employer-logo', fileNameProfilePicture)
                    }
                    //return uploadFilePromise(profilePictureFile.path, 'th-employer-logo', fileNameProfilePicture)
                })
                .then(data => {
                    if (profilePictureFile) {
                        applicantProfile['applicantPicture'] = data.Location;
                    }
                    return createUserApplicantProfile(applicantProfile);
                })
                .then(applicantProfile => {
                    fs.unlinkSync(cvFile.path);
                    //console.log(applicantProfile.applicantProfile,'a')
                    applicantProfile ? res.status(200).json({ success: true, applicantProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        }

    });
}

function createApplicant(req, res, next) {
    var fileNameCV = "";
    var fileNameProfilePicture = "";
    var form = new formidable.IncomingForm();
    form.multiples = true;

    form.on('fileBegin', function (name, file) {
        let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        let fileName = '';
        if (name == "cv") {
            fileName = fileNameCV = Date.now() + "applicant-cv";
        } else {
            fileName = fileNameProfilePicture = Date.now() + "applicant-profile";
        }

        file.path = CONSTANTS.baseDir + '/uploads/' + fileName + '.' + fileExt;
    });

    form.parse(req, (err, fields, files) => {
        let applicantProfile = {};
        _.map(fields, (value, key) => {
            applicantProfile[key] = value;
        })

        applicantProfile["password"] = uuidv4();

        applicantProfile = { ...applicantProfile, UserId: req.user.sub };
        const valid = validateApplicantProfile(applicantProfile);
        const validUser = validateUser(applicantProfile);

        if (valid != true || validUser != true) {
            if (typeof (valid) == "string" || typeof (validUser) == "string") {
                res.status(200).json({ success: false, validationError: "some required fields are not present" });
                return;
            }
            res.status(200).json({ success: false, validationError: { ...valid, ...validUser } });
            return;
        }
        const user = _.pick(applicantProfile, ['username', 'firstName', 'lastName', 'email', 'phoneNumber', 'password']);
        applicantProfile = _.omit(applicantProfile, ['username', 'firstName', 'lastName', 'email', 'phoneNumber', 'password']);

        var cvFile = files['cv'];
        var profilePictureFile = files['applicantPicture'];
        if (cvFile && cvFile.path) {
            uploadFilePromise(cvFile.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    applicantProfile['cv'] = data.Location;
                    if (profilePictureFile) {
                        return uploadFilePromise(profilePictureFile.path, 'th-employer-logo', fileNameProfilePicture)
                    }
                    //return uploadFilePromise(profilePictureFile.path, 'th-employer-logo', fileNameProfilePicture)
                })
                .then(data => {
                    if (profilePictureFile) {
                        applicantProfile['applicantPicture'] = data.Location;
                    }
                    return signUpUserApplicantFromAdmin(user);
                })
                .then(user => {
                    return createUserApplicantProfileAdmin({ ...applicantProfile, UserId: user.id });
                })
                .then(applicant => {
                    fs.unlinkSync(cvFile.path);
                    applicant ? res.status(200).json({ success: true, applicant }) : res.status(200).json({ sucess: false, error: 'Something went wrong' })
                })
                .catch(err => next(err));
        }

    });
}

function getApplicantProfile(req, res, next) {
    getUserApplicantProfile(req.user.sub)
        .then(applicantProfile => {
            if (applicantProfile) {
                res.status(200).json({ success: true, applicantProfile })
            } else {
                res.status(200).json({ success: true, applicantProfile: null })
            }
        })
        .catch(err => next(err));
}

function verifyEmail(req, res, next) {
    verifyUserEmail(req)
        .then(response => res.render('emailVerification', { layout: 'main', response }))
        .catch(err => next(err));
}

function editCompanyProfile(req, res, next) {
    const valid = validateCompanyProfile(req.body);

    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    editUserCompanyProfile({ ...req.body, user_id: req.user.sub }, req.params.id)
        .then(companyProfile => companyProfile ? res.status(200).json({ success: true, companyProfile }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getApplicants(req, res, next) {
    getAllApplicants(req.query.page || 1)
        .then(applicants => applicants ? res.status(200).json({ success: true, applicants }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function deactivateApplicant(req, res, next) {
    deactivateApplicantById(req.params.id)
        .then(user => user ? res.status(200).json({ success: true, user }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getApplicantById(req, res, next) {
    getApplicantProfileByUserId(req.params.id)
        .then(applicant => applicant ? res.status(200).json({ success: true, applicant }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}


async function getApplicantProfileByUserId(id) {
    const applicant = userService.getApplicantProfileByUserId(id);
    if (applicant) {
        return applicant;
    }

}

async function deactivateApplicantById(id) {
    //console.log(id);
    const user = await userService.getUserById(id);
    if (user.active) {
        const deactivated = await userService.updateUserField(0, 'active', id);
        const deletedAt = moment().format();
        const deleteDate = await userService.updateUserField(deletedAt, 'deletedAt', id);
        if (deleteDate[0] > 0 && deactivated[0] > 0) {
            return true;
        }
    } else {
        const deactivated = await userService.updateUserField(1, 'active', id);
        const deletedAt = moment().format();
        const deleteDate = await userService.updateUserField(deletedAt, 'deletedAt', id);
        if (deleteDate[0] > 0 && deactivated[0] > 0) {
            return true;
        }

    }
    if (deactivated && user) {
        console.log(user)
        return user;
    }
}

async function authenticateUsers({ email, password }) {
    const resp = await authService.loginFromApi({ email, password });
    console.log(resp.data);
    //console.log(resp.data, 'res')
    if (resp.data.success) {
        const user = await userService.getUserByEmail(email);
        if (user) {
            //console.log(user)
            const token = jwt.sign({ sub: user.id, role: user.role }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
            const userWithoutPassword = {};
            _.map(user.dataValues, (value, key) => {
                userWithoutPassword[key] = value;

            });
            userWithoutPassword['token'] = token;
            if (user.role = 'APPLICANT') {
                applicantProfile = await userService.getApplicantProfileByUserId(user.id);
                userWithoutPassword['applicantProfile'] = applicantProfile;
            }
            if (resp.data.user.emailVerified) {
                userWithoutPassword.emailVerified = 1;

            }
           // console.log(userWithoutPassword, 'ipass')
            return userWithoutPassword;
        }
        //return user.data;
    }

    // const user = await userService.getUserByEmail(email);
    // if (user) {
    //     const pass = bcryptjs.compareSync(password, user.password);
    //     if (pass) {

    //         if (!user.emailVerified) {
    //             return { error: "Verify you email first" }
    //         }
    //         const token = jwt.sign({ sub: user.id, role: user.role }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
    //         const userWithoutPassword = {};
    //         _.map(user.dataValues, (value, key) => {
    //             if (key == 'password') {
    //                 userWithoutPassword['token'] = token;
    //                 return;
    //             }

    //             userWithoutPassword[key] = value;
    //         });

    //         if (user.role = 'APPLICANT') {
    //             applicantProfile = await userService.getApplicantProfileByUserId(user.id);
    //             userWithoutPassword['applicantProfile'] = applicantProfile;
    //         }
    //         return userWithoutPassword;
    //     }

    // }
}

async function signUpUserApplicant(body) {

    const user = await authService.createUserApi({ ...body, emailVerificationToken: uuidv4() })
    console.log(user.data)
    if (user.data.success) {
        body["role"] = ROLE.APPLICANT;
        
        const users = await userService.createUser({ ...body, emailVerificationToken: uuidv4() });
        if(user){
            const message = construct_email_applicant(user.data.user);
            sgMail.send(message);
            return users;
        }
    }

    // const unique = await isEmailUnique(body);
    // if (unique) {
    //     body["role"] = ROLE.APPLICANT;
    //     const user = await userService.createUser({ ...body, emailVerificationToken: uuidv4() });
    //     const message = construct_email_applicant(user);
    //     sgMail.send(message);
    //     return user;
    // }

}

async function signUpUserApplicantFromAdmin(body) {
    const unique = await isEmailUnique(body);
    if (unique) {
        body["role"] = ROLE.APPLICANT;
        body["emailVerified"] = true;
        const userApi = await authService.createUserApi(body);
        const user = await userService.createUser(body);
        console.log(userApi.data)
        if (user && userApi.data.success) {
            return user;
        }
        throw "Something went wrong.";
    } else {
        throw "Email is not unique";
    }
}

async function signUpUserEmployer(body) {

    const user = await authService.createUserApi({ ...body, emailVerificationToken: uuidv4() })
    console.log(user.data)
    if (user.data.success) {
        body["role"] = ROLE.EMPLOYER;
        const users = await userService.createUser({ ...body, emailVerificationToken: uuidv4() });
        if(users){
            const message = constructEmail(body.firstName,body.email,user.data.user.emailVerificationToken);
            sgMail.send(message);
            return users;
        }
       
    }


    // const unique = await isEmailUnique(body);
    // if (unique) {

    //     body["role"] = ROLE.EMPLOYER;
    //     const user = await userService.createUser({ ...body, emailVerificationToken: uuidv4() });
    //     const message = constructEmail(user);
    //     sgMail.send(message);
    //     return user;
    // }
}

async function getUserById(user_id) {
    const user = userService.getUserById(user_id);
    if (user) {
        return user;
    }
}

async function editUserApplicantProfile(body, id) {
    body = { ...body, cityId: body.CityId, countryId: body.countryId, regionId: body.regionId };
    let applicantProfile = await userService.getApplicantProfileByUserId(body.user_id);
    if (applicantProfile && applicantProfile.id == id) {
        const updatedProfile = await userService.updateApplicantProfile(applicantProfile, body);
        if (updatedProfile) {
            return updatedProfile;
        }
    }
}

async function updateCompanyField(value, fieldName, userId) {
    const user = await userService.getUserById(userId);
    if (user && user.companyProfileId) {
        const companyProfile = await userService.updateCompanyField(value, fieldName, user.companyProfileId);
        if (companyProfile[0] && companyProfile[0] > 0) {
            const compProfile = await userService.getCompanyProfileById(user.companyProfileId);
            if (compProfile) {
                return compProfile;
            }
        }
    }
}

async function updateApplicantField(value, fieldName, userId) {
    const applicantProfile = await userService.getApplicantProfileByUserId(userId);

    if (applicantProfile) {
        const newApplicantProfile = await userService.updateApplicantProfile(applicantProfile, { [fieldName]: value });
        if (newApplicantProfile) {
            return newApplicantProfile;
        }
    }
}

async function createUserApplicantProfile(body) {
    const user = await userService.getUserByIdAndRole(body.UserId, ROLE.APPLICANT);
    let newUser = {};
    if (user) {
        const appProfile = await userService.addApplicantProfile({ ...body });
        if (appProfile) {
            newuser = await user.update({ hasFinishedProfile: true });
            //let applicantProfile = await userService.getApplicantProfileByUserId(body.UserId);
            if (newuser) {
                //console.log({...newUser,applicantProfile:applicantProfile})
                return appProfile;
            }
        }
    }
}

async function createUserApplicantProfileAdmin(body) {
    const user = await userService.getUserByIdAndRole(body.UserId, ROLE.APPLICANT);
    if (user) {
        const appProfile = await userService.addApplicantProfile({ ...body });
        if (appProfile) {
            const newUser = await user.update({ hasFinishedProfile: true });
            if (newUser) {
                const newApplicantProfile = await userService.getApplicantById(appProfile.id);
                const token = uuidv4();
                const saveToken = await otherService.saveToken(token, user.email);
                if (newApplicantProfile && saveToken) {
                    const message = constructApplicantEmail(user.email, token);
                    sgMail.send(message);
                    return newApplicantProfile;
                }
            }
        }
    }
}

async function getUserApplicantProfile(id) {
    let user = await userService.getUserById(id);
    if (user && user.role == "APPLICANT") {
        let applicantProfile = await userService.getApplicantProfileByUserId(user.id);
        if (applicantProfile) {
            return applicantProfile;
        }
    }
}

async function createUserCompanyProfile(body) {
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    // console.log(user, 'user')
    if (user) {
        const compProfile = await userService.addCompanyProfile(body);
        if (compProfile) {
            const updated = await userService.updateUserById(user.id, { companyProfileId: compProfile.id, hasFinishedProfile: true });
            if (updated) {
                return await userService.getUserById(updated.id);
            }
        }
    }
}

async function editUserCompanyProfile(body, id) {
    let user = await userService.getUserById(body.user_id);
    if (user) {
        if (user.companyProfileId == id) {
            let compProfile = await userService.updateCompanyProfileById(id, body);
            if (compProfile) {
                let newUser = await userService.getUserById(body.user_id);
                if (newUser) {
                    return newUser;
                }
            }
        }
    }
}

async function verifyUserEmail(req) {
    const user = await authService.verifyUserFromApi(req.query.token);
    // console.log(user.data);
    if (user.data.success) {
        const updated = await userService.updateUserByEmail(user.data.user.email, { emailVerified: true });
        if (updated) {
            return { success: true, message: "Email verified successfully.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }
        }
        return { success: false, message: "Cannot varify account.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }

    }
    return { success: false, message: "Cannot verify account.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }


    // const user = await userService.getUserByEmailToken(req.query.token);
    // if (user) {
    //     const updated = await userService.updateUserById(user.id, { emailVerified: true });
    //     if (updated) {
    //         return { success: true, message: "Email verifyed successfully.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }
    //     }
    // }

    // return { success: false, message: "Cannot varify account.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }
}

async function isEmailUnique({ email }) {
    const foundEmail = await userService.getUserByEmail(email);
    if (foundEmail) {
        return false;
    }
    return true;
}

async function getAllApplicants(page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const applicant = await userService.getAllApplicants(offset, limit);

    if (applicant) {
        pager.totalItems = applicant.count;
        pager.totalPages = Math.ceil(applicant.count / pager.pageSize);
        return {
            pager,
            rows: applicant.rows
        }
    }

}

async function socialAuthHandler(provider, access_token, socialId, localUser){
    if(provider == 'facebook'){
        let facebookAuth = await axios.get(`https://graph.facebook.com/me?access_token=${access_token}`);
        facebookAuth = facebookAuth.data;
        if(!facebookAuth.id){
            throw "invalid social token"
        }
    
        if(facebookAuth.id != socialId){
            throw "invalid social token"
        }

    }else{
        let googleAuth = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`);
        googleAuth = googleAuth.data;
    
        if(!googleAuth.sub){
            throw "invalid social token"
        }
    
        if(googleAuth.sub != socialId){
            throw "invalid social token"
        }
    }
    const { email, firstName, lastName, role } = localUser;
    if(!email || !firstName || !lastName){
        throw "invalid user"
    }

    const emailUnique = await isEmailUnique({email});
    if(!emailUnique){
        let authUser = await axios.post(`${CONSTANTS.AUTH_SERVER}/auth/social_login`, {email, socialId});
        // console.log(authUser.data);
        if(!authUser || !authUser.data.success){
            
            throw "something went wrong";
        }

        authUser = authUser.data.user;

        
        let localUser = await userService.getUserById(authUser.id);
        if(!localUser){
            throw "something went wrong";
        }

        const token = jwt.sign({ sub: localUser.id, role: localUser.role }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
    
        // console.log(token);

        const userWithoutPassword = {};
        _.map(localUser.dataValues, (value, key) => {
            if (key == 'password') {
                return;
            }
            userWithoutPassword[key] = value;
        });

        userWithoutPassword.token = token;
        
        return userWithoutPassword;
    }else{
        
        let authUser = await axios.post(`${CONSTANTS.AUTH_SERVER}/auth/social_signup`, {email, firstName, lastName, phoneNumber: "", socialId});
        if(!authUser){
            throw "something went wrong";
        }

        authUser = authUser.data.user;

        // console.log({email, firstName, lastName, phoneNumber: "", socialId});

        let localUser = await userService.createUser({...authUser, role, active: true, emailVerified:true});
        if(!localUser){
            throw "something went wrong";
        }

        const token = jwt.sign({ sub: localUser.id, role: localUser.role }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
    
        const userWithoutPassword = {};
        _.map(localUser.dataValues, (value, key) => {
            if (key == 'password') {
                return;
            }
            userWithoutPassword[key] = value;
        });

        userWithoutPassword.token = token;
        
        return userWithoutPassword;
    }
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
    updateCompanyBusinessLicense,
    getAllEmployers,
    admnCreateCompanyProfileWithBusinessLicenseAndLogo,
    changeUserPassword,
    createApplicant,
    getApplicants,
    deactivateApplicant,
    getApplicantById,
    getCompanyProfile,
    facebookAuth,
    googleAuth,
    forgetPassword,
    resetPasswordFromEmail
}
