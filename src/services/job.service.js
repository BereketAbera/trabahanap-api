const {
    Job,
    CompanyProfile,
    JobApplication,
    ApplicantProfile,
    Location,
    JobLaterReview
} = require('../models');

const sequelize = require('../database/connection');

async function getJobsWithOffsetAndLimit(offset, limit){
    return await Job.findAndCountAll({offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

async function getCompanyJobsWithOffsetAndLimit(offset, limit, companyProfileId){
    return await Job.findAndCountAll({where: {companyProfileId}, offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

async function addJob(job){
    return await Job.create(job).catch(err => console.log(err));
}

function addJobApplication(jobApplication){
    return JobApplication.create(jobApplication).catch(err => console.log(err));
}

async function editJobById(id, newJob){
    const job = await Job.findOne({where: {id}}).catch(err => console.log(err));
    return await job.update(newJob).catch(err => console.log(err));
}

async function getJobById(id){
    return Job.findOne({where: {id}, include: [{model: CompanyProfile}, {model: Location}]}).catch(err => console.log(err));
}

function getApplicationByProfileIdAndJobId(JobId, ApplicantProfileId){
    return JobApplication.findOne({where: {JobId, ApplicantProfileId}}).catch(err => console.log(err));
}

function getApplicantApplications(ApplicantProfileId){
    return JobApplication.findAll({where: {ApplicantProfileId}, include: [{model: CompanyProfile}, {model: ApplicantProfile}, {model: Job}]}).catch(err => console.log(err));
}

function getEmployerJobApplications(JobId, CompanyProfileId){
    return JobApplication.findAll({where: {JobId, CompanyProfileId}, include: [{model: CompanyProfile}, {model: ApplicantProfile}, {model: Job}]}).catch(err => console.log(err));
}

function getJobsWithApplications(CompanyProfileId){
    return sequelize.query(`SELECT * FROM view_job_applications WHERE CompanyProfileId='${CompanyProfileId}'`, { type: sequelize.QueryTypes.SELECT})
}

function getJobApplications(JobId){
    return JobApplication.findAll({where: {JobId}, include: [{model: ApplicantProfile}]}).catch(err => console.log(err));
}

function getApplicantById(applicantId){
    return ApplicantProfile.findOne({where: {id: applicantId}});
}

function getJobApplicants(jobId){
    return sequelize.query(`SELECT a.id, a.currentEmployer, a.gender, a.dateOfBirth, a.address, u.email, u.firstName, u.lastName from job_applications ja LEFT JOIN applicant_profiles a ON a.id = ja.applicantProfileId LEFT JOIN users u ON u.id = a.userId where ja.jobId = '${jobId}'`);
}

function getApplicantJobs(applicantId){
    return sequelize.query(`SELECT j.id, j.jobTitle, j.jobDescription, j.industry, j.position, j.educationAttainment, j.salaryRange, j.employmentType, j.vacancies, j.additionalQualifications, j.applicationEndDate, j.applicationStartDate, j.companyProfileId, cp.companyName, cp.contactNumber, cp.industryType, cp.companyLogo, cp.companyAddress, ja.applicationDate from job_applications ja LEFT JOIN jobs j ON j.id = ja.jobId LEFT JOIN company_profiles cp ON cp.id = j.companyProfileId where ja.applicantProfileId = '${applicantId}'`);
}

function getApplicantSavedJobs(applicantId){
    return sequelize.query(`SELECT j.id, j.jobTitle, j.jobDescription, j.industry, j.position, j.educationAttainment, j.salaryRange, j.employmentType, j.vacancies, j.additionalQualifications, j.applicationEndDate, j.applicationStartDate, j.companyProfileId, cp.companyName, cp.contactNumber, cp.industryType, cp.companyLogo, cp.companyAddress from job_later_reviews jl LEFT JOIN jobs j ON j.id = jl.jobId LEFT JOIN company_profiles cp ON cp.id = j.companyProfileId where jl.applicantProfileId = '${applicantId}'`);
}

function saveJobForLaterReview(ApplicantProfileId, JobId){
    return JobLaterReview.create({ApplicantProfileId, JobId}).catch(err => console.log(err));
}

function getSavedJob(ApplicantProfileId, JobId){
    return JobLaterReview.findOne({where: {JobId, ApplicantProfileId}});
}

function removeJobFromLaterReview(ApplicantProfileId, JobId){
    return JobLaterReview.destroy({where: {JobId, ApplicantProfileId}});
}

module.exports = {
    getJobsWithOffsetAndLimit,
    addJob,
    editJobById,
    getJobById,
    getCompanyJobsWithOffsetAndLimit,
    addJobApplication,
    getApplicationByProfileIdAndJobId,
    getApplicantApplications,
    getEmployerJobApplications,
    getJobsWithApplications,
    getJobApplications,
    getApplicantById,
    getJobApplicants,
    getApplicantJobs,
    saveJobForLaterReview,
    getSavedJob,
    removeJobFromLaterReview,
    getApplicantSavedJobs,
    // getApplicantApplication
}