const {
    Indutry, Issue,
    Token, User,Reports,Advertisement,
    Job, JobApplication,
    CompanyProfile,
    ApplicantProfile,
    IssueResponse
} = require('../models');
const jobService = require('./job.service');

const ROLE = require('../_helpers/role');
const sequelize = require('../database/connection');

async function getAdminStats() {
    let employers = await CompanyProfile.count();
    let applicants = await User.count({ where: { role: ROLE.APPLICANT, emailVerified: 1 }});
    let jobs = await Job.count({where:{ active:1}});
    let applications = await JobApplication.count();
    // let applications = await sequelize.query(`SELECT COUNT(*) FROM view_filtered_job_applications AS count`, { type: sequelize.QueryTypes.SELECT });

    return { employers, applicants, jobs, applications:applications }
}

async function getIssueStats() {
    let employerIssues = await Issue.count({ where: { ApplicantProfileId: null }});
    let newEmployerIssues = await Issue.count({ where: { ApplicantProfileId: null, IssueResponseId: null }});
    let applicantIssues = await Issue.count({ where: { CompanyProfileId: null }});
    let newApplicantIssues = await Issue.count({ where: { CompanyProfileId: null, IssueResponseId: null }});
    let reportedJobs = await Reports.count();
    let newReportedJobs = await Reports.count({ where:{ checked: 0 }});
    // let applications = await sequelize.query(`SELECT COUNT(*) FROM view_filtered_job_applications AS count`, { type: sequelize.QueryTypes.SELECT });

    return { 
        employerStats: {employerIssues, newEmployerIssues}, 
        applicantStats: {applicantIssues, newApplicantIssues}, 
        reportStats: {reportedJobs, newReportedJobs} 
    }
}

async function getApplicantStats(ApplicantProfileId){
    let jobCount = await Job.count({ where: {active:1}});
    let employers = await CompanyProfile.count({ where: { verified: true }});
    let applications = await JobApplication.count({ where: {ApplicantProfileId}});
    let filtered = await JobApplication.count({ where: {ApplicantProfileId,filtered:1}});

    // let filtered = await sequelize.query(`SELECT COUNT(*) FROM view_filtered_job_applications AS count WHERE CompanyProfileId='${CompanyProfileId}' `, { type: sequelize.QueryTypes.SELECT })
    
    return { jobs: jobCount, emp: employers, applications, filtered:filtered}
}
async function getEmployerStats(CompanyProfileId) {
    let jobCount = await Job.count({ where: {CompanyProfileId,active:1}});
    let staffCount = await User.count({ where: {CompanyProfileId, role: ROLE.STAFFER, emailVerified: true}});
    let applications = await JobApplication.count({ where: {CompanyProfileId}});
    let filtered = await JobApplication.count({ where: {CompanyProfileId,filtered:1}});

    // let filtered = await sequelize.query(`SELECT COUNT(*) FROM view_filtered_job_applications AS count WHERE CompanyProfileId='${CompanyProfileId}' `, { type: sequelize.QueryTypes.SELECT })
    
    return { jobs: jobCount, staff: staffCount, applications, filtered:filtered}
}

function getAllIndustries(){
    return Indutry.findAll().catch(err => console.log(err));
}
function getIndutriesSearch(search){
    return sequelize.query(`SELECT * FROM industries WHERE industryName like '${search}%'`, { type: sequelize.QueryTypes.SELECT })
}

function addIssue(issue){
    return Issue.create(issue).catch(err => console.log(err));
}
function addReports(reports){
    return Reports.create(reports).catch(err => console.log(err));
}
function addAdvertisement(ads){
    return Advertisement.create(ads).catch(err => console.log(err));
}
function getApplicantIssues(ApplicantProfileId){
    return Issue.findAll({where: {ApplicantProfileId}, include: [{model: IssueResponse}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getEmployerIssues(CompanyProfileId){
    return Issue.findAll({where: {CompanyProfileId}, include: [{model: IssueResponse}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getReportedIssueById(id) {
    return Issue.findOne({where: {id}, include: [{model: IssueResponse}]}).catch(err => console.log(err));
}

function getReportById(id){
    return Reports.findOne( {where:{id},include: [{model: ApplicantProfile,include:[{model:User}]},{model:Job,include:[{model:CompanyProfile}]}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function updateReportField(value,fieldName,id){
    return Reports.update({[fieldName]: value},{where: {id: id}});
}
function getApplicantIssueById(ApplicantProfileId, id){
    return Issue.findOne({where: {ApplicantProfileId, id}, include: [{model: IssueResponse}]}).catch(err => console.log(err)); 
}

function getEmployerIssueById(CompanyProfileId, id){
    return Issue.findOne({where: {CompanyProfileId, id}, include: [{model: IssueResponse}]}).catch(err => console.log(err)); 
}

function deleteEmployerIssue(CompanyProfileId, id) {
    return Issue.destroy({where: {CompanyProfileId, id}}).catch(err => console.log(err)); 
}

function deleteApplicantIssue(ApplicantProfileId, id) {
    return Issue.destroy({where: {ApplicantProfileId, id}}).catch(err => console.log(err)); 
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

function getTokensByEmail(email) {
    return Token.findAndCountAll({ where: {email}, order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

async function updateToken(token, value){
    const newToken = await Token.findOne({where: {token}}).catch(err => console.log(err));
    // console.log(newToken);
    return newToken.update(value);
}

function getAdminStaffs(offset,limit){
    return User.findAndCountAll({where: {role: ROLE.ADMINSTAFF, emailVerified: true}, offset, limit }).catch(err => console.log(err));
}

function getCompanyStaffs(CompanyProfileId){
    return User.findAll({where: {role: ROLE.STAFFER, CompanyProfileId}}).catch(err => console.log(err));
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
function getAllReportedApplicant(){
    return Reports.findAll( {where:{ checked:false },limit:8,include: [{model: ApplicantProfile,include:[{model:User}]},{model:Job}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
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

function getFilteredApplicant(CompanyProfileId){
    return JobApplication.findAndCountAll({where: {CompanyProfileId,filtered:1}}).catch(err => console.log(err))
}

function getAllAdsWithOffset(offset,limit){
    return Advertisement.findAndCountAll({offset,limit}).catch(err => console.log(err))
}

function getFeaturedCompanies(){
    // console.log('feating companies');
    return CompanyProfile.findAll({where: {featured: true}}).catch(err => console.log(err));
}

function getTokenByEmailAndToken(email, token){
    return Token.findOne({where: {token, email, expired: false}}).catch(err => console.log(err));
}
function getAdsById(id){
    return Advertisement.findOne({where: { id }}).catch(err => console.log(err));
}

function getAdsByRanges(now,endDay){
    return sequelize.query(`SELECT * FROM advertisement WHERE active='1' AND adsEnd >= '${now}' AND adsStart < '${endDay}' `, { type: sequelize.QueryTypes.SELECT })
}

// function getCompanyProfileById(id){
//     return CompanyProfile.findOne({where: {id}}).catch(err => console.log(err));
// }

module.exports = {
    getAdminStats,
    getIssueStats,
    getEmployerStats,
    getApplicantStats,
    getAllIndustries,
    addIssue,
    getApplicantIssues,
    getEmployerIssues,
    deleteEmployerIssue,
    deleteApplicantIssue,
    getReportedIssueById,
    getApplicantIssueById,
    getEmployerIssueById,
    saveToken,
    getToken,
    getTokenEmail,
    getTokensByEmail,
    updateToken,
    getAdminStaffs,
    getCompanyStaffs,
    getAllEmployers,
    getAllReportedIssues,
    getAllReportedApplicantIssues,
    getAllReportedApplicant,
    getAllReportedCompanyIssues,
    addIssueResponse,
    updateIssueField,
    getIssueById,
    getIndutriesSearch,
    getFilteredApplicant,
    getFeaturedCompanies,
    getTokenByEmailAndToken,
    addReports,
    getFeaturedCompanies,
    getReportById,
    updateReportField,
    addAdvertisement,
    getAllAdsWithOffset,
    getAdsById,
    getAdsByRanges
}