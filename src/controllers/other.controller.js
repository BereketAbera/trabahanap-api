const otherService = require('../services/other.service');
const userService = require('../services/user.service');
const ROLE = require('../_helpers/role');

const { validateIssue } = require('../_helpers/validators');
const constractStafferEmail = require('../_helpers/construct_staffer_email');
const uuidv4 = require('uuid/v4');
const sgMail = require('@sendgrid/mail');
const CONSTANTS = require('../../constants');
const bcryptjs = require('bcryptjs');
sgMail.setApiKey(CONSTANTS.SENDGRID_KEY);


function getAllIndustries(req, res, next){
    getIndutries()
        .then(industries => res.status(200).send({success: true, industries}))
        .catch(err => next(err));
}

function addIssue(req, res, next){
    const valid = validateIssue(req.body);
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    addApplicantIssue(req.body, req.user.sub)
        .then(issue => res ? res.status(200).send({success: true, issue}) : res.status(200).send({success: false, error: "Something went wrong!"}))
        .catch(err => next(err));
}

function getIssues(req, res, next){
    getApplicantIssues(req.user.sub)
        .then(issues => issues ? res.status(200).send({success: true, issues}) : res.status(200).send({success: false, error: "Something went wrong!"}))
        .catch(err => next(err));
}

function getStaffs(req, res, next){
    getEmployerStaffs(req.user.sub)
        .then(staffs => staffs ? res.status(200).send({success: true, staffs}) : res.status(200).send({success: false, error: "Something went wrong!"}))
        .catch(err => next(err));
}

function getIssue(req, res, next){
    getApplicantIssue(req.user.sub, req.params.id)
        .then(issue => issue ? res.status(200).send({success: true, issue}) : res.status(200).send({success: false, error: "Something went wrong!"}))
        .catch(err => next(err));
}

function addStaff(req, res, next){
    addCompanyStaffer(req.body, req.user.sub)
        .then(success => res.status(200).send({success}))
        .catch(err => next(err));
}

function addNewStaffer(req, res, next){
    renderNewStafferPassword(req)
        .then(response => res.render('addNewStaffer', {layout: 'main', response}))
        .catch(err => next(err));
}

function changeStafferPassword(req, res, next){
    var response = {...req.body, error: "", passwordChanged: false, processed: false};
    if(req.body.password.length < 5){
        response.error = "Password must be at list 6 characters";
        res.render('addNewStaffer', {layout: 'main', response});
        return;
    }else if(req.body.password != req.body.comfirm_password){
        response.error = "Passwords does not much";
        res.render('addNewStaffer', {layout: 'main', response});
        return;
    }

    // console.log(response);
    
    changeNewStafferPassword(req.body, response.token)
        .then(success => {
            response.processed = true;
            if(success){
                response.passwordChanged = true;
            }else{
                response.passwordChanged = false;
            }

            res.render('addNewStaffer', {layout: 'main', response});
            return;
        })
        .catch(err => next(err));
}

function getEmployers(req, res, next){
    getAllEmployers()
        .then(employers => employers ? res.status(200).send({success: true, employers}) : res.status(200).send({success: false, error: "Something went wrong!"}))
        .catch(err => next(err));
}

function verifyEmployer(req, res, next){
    verifyEmployerLicense(req.params.id)
        .then(success => res.status(200).send({success}))
        .catch(err => next(err));
}

function getAllIssues(req, res, next){
    getAllReportedIssues()
        .then(issues => issues ? res.status(200).send({success: true, issues}) : res.status(200).send({success: false, error: "Something went wrong!"}))
        .catch(err => next(err));
}


async function getIndutries(){
    const industries = await otherService.getAllIndustries();
    if(industries){
        return industries;
    }
}

async function addApplicantIssue(issue, userId){
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if(applicant){
        const newIssue = await otherService.addIssue({...issue, ApplicantProfileId: applicant.id});
        if(newIssue){
            return newIssue;
        }
    }
}

async function getApplicantIssues(userId){
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if(applicant){
        const issues = await otherService.getApplicantIssues(applicant.id);
        if(issues){
            return issues;
        }
    }
}

async function getEmployerStaffs(userId){
    const user = await userService.getUserById(userId);
    if(user && user.company_profile){
        const staffs = await otherService.getCompanyStaffs(user.companyProfileId);
        if(staffs){
            return staffs;
        }
    }
}

async function getApplicantIssue(userId, issueId){
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if(applicant){
        const issue = await otherService.getApplicantIssueById(applicant.id, issueId);
        if(issue){
            return issue;
        }
    }
}

async function addCompanyStaffer(body, userId){
    const user = await userService.getUserById(userId);
    if(user && user.companyProfileId, body.email){
        const userExists = await userService.getUserByEmail(body.email);
        const tokenExists = await otherService.getTokenEmail(body.email);
        if(userExists || tokenExists){
            return false;
        }
        const token = uuidv4();
        const saveToken = await otherService.saveToken(token, body.email);
        const newUser = await userService.createUser({...body, role: ROLE.STAFFER, companyProfileId: user.companyProfileId, password: uuidv4(), username: body.email, hasFinishedProfile: true});
        if(saveToken && newUser){
            const message = constractStafferEmail(body.email, token);
            sgMail.send(message);
            return true;
        }
    }
    return false;
}

async function renderNewStafferPassword(req){
    if(req.params.token && req.params.token){
        const exists = await otherService.getToken(req.params.token)
        if(exists){
            return {...req.params, verified: true, passwordChanged: false, processed: false}
        }
    }
    return {...req.params, verified: false, passwordChanged: false, processed: false}
}

async function changeNewStafferPassword(body, token){
    // console.log(token);
    const user = await userService.getUserByEmail(body.email);
    if(user){
        // const updatedUser = await userService.updateUserField(bcryptjs.hashSync(body.password, 10), 'password', user.id);
        const updatedUser = await userService.updateUserById(user.id, {password: bcryptjs.hashSync(body.password, 10), emailVerified: true});
        const updateToken = await otherService.updateToken(token, {expired: true});
        if(updatedUser && updateToken){
            return true;
        }
    }

    return false;
}

async function getAllEmployers(){
    const employers = await otherService.getAllEmployers();
    if(employers){
        return employers;
    }
}

async function verifyEmployerLicense(id){
    const companyProfile = await userService.getCompanyProfileById(id);
    if(companyProfile){
        const verified = await userService.updateCompanyField(true, 'verified', id);
        if(verified[0] > 0){
            return true;
        }
    }

    return false;
}

async function getAllReportedIssues(){
    const issues = await otherService.getAllReportedIssues();
    if(issues){
        return issues;
    }
}

module.exports = {
    getAllIndustries,
    addIssue,
    getIssues,
    getIssue,
    addStaff,
    addNewStaffer,
    changeStafferPassword,
    getStaffs,
    getEmployers,
    verifyEmployer,
    getAllIssues
}