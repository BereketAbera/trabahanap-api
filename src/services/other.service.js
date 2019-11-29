const {
    Indutry,
    Issue
} = require('../models');

function getAllIndustries(){
    return Indutry.findAll().catch(err => console.log(err));
}

function addIssue(issue){
    return Issue.create(issue).catch(err => console.log(err));
}

function getApplicantIssues(ApplicantProfileId){
    return Issue.findAll({where: {ApplicantProfileId}}).catch(err => console.log(err));
}

function getApplicantIssueById(ApplicantProfileId, id){
    return Issue.findOne({where: {ApplicantProfileId, id}}).catch(err => console.log(err)); 
}

module.exports = {
    getAllIndustries,
    addIssue,
    getApplicantIssues,
    getApplicantIssueById
}