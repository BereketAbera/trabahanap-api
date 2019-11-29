const otherService = require('../services/other.service');
const userService = require('../services/user.service');

const { validateIssue } = require('../_helpers/validators');


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

function getIssue(req, res, next){
    getApplicantIssue(req.user.sub, req.params.id)
        .then(issue => issue ? res.status(200).send({success: true, issue}) : res.status(200).send({success: false, error: "Something went wrong!"}))
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

async function getApplicantIssue(userId, issueId){
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if(applicant){
        const issue = await otherService.getApplicantIssueById(applicant.id, issueId);
        if(issue){
            return issue;
        }
    }
}


module.exports = {
    getAllIndustries,
    addIssue,
    getIssues,
    getIssue
}