require('dotenv').config();
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
const _ = require('lodash');
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
const constructApplicantEmail = require('../_helpers/construct_applicant_email');
const construct_employer_email = require('../_helpers/construct_employer_email');
const userService = require('../services/user.service');
const jobService = require('../services/job.service');
const otherService = require('../services/other.service');
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
            if (user && user.error) {
                res.status(200).json({ success: false, error: user.error });
                return;
            }
            user ? res.status(200).json({ success: true, user }) : res.status(200).json({ success: false, error: 'username or password is incorrect' })
        })
        .catch(err => next(err));
}

function signUpApplicant(req, res, next) {
    const valid = validateUser(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    req.body.username = req.body.email;

    signUpUserApplicant(req.body)
        .then(applicant => applicant ? res.status(200).json({ success: true, applicant }) : res.status(200).json({ success: false, error: 'email is not unique' }))
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

        if (valid != true) {
            res.status(200).json({ success: false, validationError: valid });
            return;
        }

        const valid_user = validateUser({ ...companyProfile, password: '1234' });
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

        const tokenExists = await otherService.getTokenEmail(body.email);
        if (tokenExists) {
            return false;
        }
        const token = uuidv4();
        const saveToken = await otherService.saveToken(token, body.email);
        const { email, username, phoneNumber, password, firstName, lastName, gender, role, emailVerified, hasFinishedProfile } = { ...body };
        const user = await userService.createUser({ email, username, phoneNumber, password, firstName, lastName, gender, role, emailVerified, hasFinishedProfile });
      
        if (saveToken && user) {
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

function changeEmployerPassword(req, res, next) {
    var response = { ...req.body, error: "", passwordChanged: false, processed: false };
    if (req.body.password.length < 5) {
        response.error = "Password must be at list 6 characters";
        res.render('setEmployerPassword', { layout: 'main', response });
        return;
    } else if (req.body.password != req.body.comfirm_password) {
        response.error = "Passwords does not much";
        res.render('setEmployerPassword', { layout: 'main', response });
        return;
    }

    console.log(response);

    changeNewEmployerPassword(req.body, response.token)
        .then(success => {
            response.processed = true;
            if (success) {
                response.passwordChanged = true;
            } else {
                response.passwordChanged = false;
            }

            res.render('setEmployerPassword', { layout: 'main', response });
            return;
        })
        .catch(err => next(err));
}

async function changeNewEmployerPassword(body, token) {
    // console.log(token);
    const user = await userService.getUserByEmail(body.email);
    if (user) {
        // const updatedUser = await userService.updateUserField(bcryptjs.hashSync(body.password, 10), 'password', user.id);
        const updatedUser = await userService.updateUserById(user.id, { password: bcryptjs.hashSync(body.password, 10), emailVerified: true });
        const updateToken = await otherService.updateToken(token, { expired: true });
        if (updatedUser && updateToken) {
            return true;
        }
    }

    return false;
}

function addNewEmployerPassword(req, res, next) {
    renderNewEmployerPassword(req)
        .then(response => res.render('setEmployerPassword', { layout: 'main', response }))
        .catch(err => next(err));
}

async function renderNewEmployerPassword(req) {
    if (req.params.token && req.params.token) {
        const exists = await otherService.getToken(req.params.token)
        if (exists) {
            return { ...req.params, verified: true, passwordChanged: false, processed: false }
        }
    }
    return { ...req.params, verified: false, passwordChanged: false, processed: false }
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

        companyProfile = { ...companyProfile, CityId: companyProfile.cityId, RegionId: companyProfile.regionId, CountryId: companyProfile.countryId };
        const valid = validateCompanyProfile(companyProfile);
        if (valid != true) {
            res.status(200).json({ success: false, validationError: valid });
            return;
        }


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

        var cvFile = files['cv'];
        var profilePictureFile = files['applicantPicture']
        if (cvFile && profilePictureFile) {
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
        if (cvFile && profilePictureFile && cvFile.path && profilePictureFile.path) {
            uploadFilePromise(cvFile.path, 'th-applicant-cv', fileNameCV)
                .then(data => {
                    applicantProfile['cv'] = data.Location;
                    return uploadFilePromise(profilePictureFile.path, 'th-employer-logo', fileNameProfilePicture)
                })
                .then(data => {
                    applicantProfile['applicantPicture'] = data.Location;
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
    getAllApplicants()
        .then(applicants => applicants ? res.status(200).json({ success: true, applicants }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}


async function authenticateUsers({ email, password }) {
    const user = await userService.getUserByEmail(email);
    if (user) {
        const pass = bcryptjs.compareSync(password, user.password);
        if (pass) {

            if (!user.emailVerified) {
                return { error: "Verify you email first" }
            }
            const token = jwt.sign({ sub: user.id, role: user.role }, CONSTANTS.JWTSECRET, { expiresIn: '24h' });
            const userWithoutPassword = {};
            _.map(user.dataValues, (value, key) => {
                if (key == 'password') {
                    userWithoutPassword['token'] = token;
                    return;
                }

                userWithoutPassword[key] = value;
            });
            return userWithoutPassword;
        }
    }
}

async function signUpUserApplicant(body) {
    const unique = await isEmailUnique(body);
    if (unique) {
        body["role"] = ROLE.APPLICANT;
        const user = await userService.createUser({ ...body, emailVerificationToken: uuidv4() });
        const message = constructEmail(user);
        sgMail.send(message);
        return user;
    }

}


async function signUpUserApplicantFromAdmin(body) {
    const unique = await isEmailUnique(body);
    if (unique) {
        body["role"] = ROLE.APPLICANT;
        body["emailVerified"] = true;

        const user = await userService.createUser(body);
        if (user) {
            return user;
        }
        throw "Something went wrong.";
    } else {
        throw "Email is not unique";
    }
}

async function signUpUserEmployer(body) {
    const unique = await isEmailUnique(body);
    if (unique) {

        body["role"] = ROLE.EMPLOYER;
        const user = await userService.createUser({ ...body, emailVerificationToken: uuidv4() });
        const message = constructEmail(user);
        sgMail.send(message);
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
    if (user) {
        const appProfile = await userService.addApplicantProfile({ ...body });
        if (appProfile) {
            const newUser = await user.update({ hasFinishedProfile: true });
            // if(user)
            if (newUser) {
                return newUser;
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
                if(newApplicantProfile && saveToken){
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
    const user = await userService.getUserByEmailToken(req.query.token);
    if (user) {
        const updated = await userService.updateUserById(user.id, { emailVerified: true });
        if (updated) {
            return { success: true, message: "Email verifyed successfully.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }
        }
    }

    return { success: false, message: "Cannot varify account.", HOST_URL: CONSTANTS.HOST_URL_FRONTEND }
}

async function isEmailUnique({ email }) {
    const foundEmail = await userService.getUserByEmail(email);
    if (foundEmail) {
        return false;
    }
    return true;
}

async function getAllApplicants() {
    const employers = await userService.getAllApplicants();
    if (employers) {
        return employers;
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
    changeEmployerPassword,
    addNewEmployerPassword,
    createApplicant,
    getApplicants
}
