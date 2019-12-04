const {
    Indutry,
    Issue,
    Token,
    User,
    CompanyProfile
} = require('../models');

const ROLE = require('../_helpers/role');

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

function saveToken(token, email){
    return Token.create({token, email}).catch(err => console.log(err));
}

function getToken(token){
    return Token.findOne({where: {token, expired: false}}).catch(err => console.log(err));
}

function getTokenEmail(email){
    return Token.findOne({where: {email, expired: false}}).catch(err => console.log(err));
}

async function updateToken(token, value){
    const newToken = await Token.findOne({where: {token}}).catch(err => console.log(err));
    // console.log(newToken);
    return newToken.update(value);
}

function getCompanyStaffs(CompanyProfileId){
    return User.findAll({where: {role: ROLE.STAFFER, CompanyProfileId, emailVerified: true}}).catch(err => console.log(err));
}

function getAllEmployers(){
    return User.findAll({where: {role: ROLE.EMPLOYER}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

function getAllReportedIssues(){
    return Issue.findAll().catch(err => console.log(err));
}

module.exports = {
    getAllIndustries,
    addIssue,
    getApplicantIssues,
    getApplicantIssueById,
    saveToken,
    getToken,
    getTokenEmail,
    updateToken,
    getCompanyStaffs,
    getAllEmployers,
    getAllReportedIssues
}