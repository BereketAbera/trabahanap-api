const {
    Indutry,
    Issue,
    Token,
    User,
    CompanyProfile,
    ApplicantProfile,
    IssueResponse
} = require('../models');

const ROLE = require('../_helpers/role');
const sequelize = require('../database/connection');

function getAllIndustries(){
    return Indutry.findAll().catch(err => console.log(err));
}
function getIndutriesSearch(search){
    return sequelize.query(`SELECT * FROM industries WHERE industryName like '${search}%'`, { type: sequelize.QueryTypes.SELECT })
}

function addIssue(issue){
    return Issue.create(issue).catch(err => console.log(err));
}

function getApplicantIssues(ApplicantProfileId){
    return Issue.findAll({where: {ApplicantProfileId}, include: [{model: IssueResponse}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getEmployerIssues(CompanyProfileId){
    return Issue.findAll({where: {CompanyProfileId}, include: [{model: IssueResponse}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getApplicantIssueById(ApplicantProfileId, id){
    return Issue.findOne({where: {ApplicantProfileId, id}, include: [{model: IssueResponse}]}).catch(err => console.log(err)); 
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

function getAdminStaffs(){
    return User.findAll({where: {role: ROLE.ADMINSTAFF, emailVerified: true}}).catch(err => console.log(err));
}

function getCompanyStaffs(CompanyProfileId){
    return User.findAll({where: {role: ROLE.STAFFER, CompanyProfileId, emailVerified: true}}).catch(err => console.log(err));
}

function getAllEmployers(){
    return User.findAll({where: {role: ROLE.EMPLOYER}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}


function getAllReportedIssues(){
    return Issue.findAll({include: [{model: IssueResponse},{model: ApplicantProfile,include:[{model:User}]}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getAllReportedApplicantIssues() {
    return Issue.findAll({where: {CompanyProfileId: null}, include: [{model: IssueResponse},{model: ApplicantProfile,include:[{model:User}]}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getAllReportedCompanyIssues() {
    return Issue.findAll({where: {ApplicantProfileId: null}, include: [{model: IssueResponse},{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));

}

function addIssueResponse(issueResponse){
    return IssueResponse.create(issueResponse).catch(err => console.log(err));
}

function updateIssueField(value, fieldName, issueId){
    return Issue.update({[fieldName]: value},{where: {id: issueId}});
}

function getIssueById(issueId){
    return Issue.findOne({where: {id: issueId}}).catch(err => console.log(err));
}


module.exports = {
    getAllIndustries,
    addIssue,
    getApplicantIssues,
    getEmployerIssues,
    getApplicantIssueById,
    saveToken,
    getToken,
    getTokenEmail,
    updateToken,
    getAdminStaffs,
    getCompanyStaffs,
    getAllEmployers,
    getAllReportedIssues,
    getAllReportedApplicantIssues,
    getAllReportedCompanyIssues,
    addIssueResponse,
    updateIssueField,
    getIssueById,
    getIndutriesSearch
}