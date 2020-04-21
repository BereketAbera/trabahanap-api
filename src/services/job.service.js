const {
  User,
  Job,
  CompanyProfile,
  JobApplication,
  ApplicantProfile,
  Location,
  JobLaterReview,
  City,
  Region
} = require("../models");

const sequelize = require("../database/connection");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function getJobsWithOffsetAndLimit(offset, limit) {
  let now = new Date().toISOString();
  return await Job.findAndCountAll({
    where: {
      active: 1,
      applicationStartDate: {
        lt: now
      },
      applicationEndDate: {
        gt: now
      }
    },
    offset,
    limit,
    include: [{ model: CompanyProfile }],
    order: [["createdAt", "DESC"]]
  }).catch(err => console.log(err));
}

async function getCompanyJobsWithOffsetAndLimit(
  offset,
  limit,
  companyProfileId
) {
  return await Job.findAndCountAll({
    where: { companyProfileId, active: 1 },
    offset,
    limit,
    include: [{ model: CompanyProfile }, { model: User }],
    order: [["createdAt", "DESC"]]
  }).catch(err => console.log(err));
}

function getAllPwdJobs(offset,limit){
  let query = `SELECT j.*, cp.companyName,(select count(*) FROM job_applications WHERE job_applications.JobId = j.id) as application,(select count(*) FROM job_applications WHERE job_applications.JobId = j.id and job_applications.hired=1) as hired FROM jobs j left join company_profiles cp on cp.id = j.CompanyProfileId where pwd=1  limit ${offset} ,${limit}`;
  return sequelize.query(
    query,
    { type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.log(err));
}

function getCompanyJobswithThierApplication(offset, limit, companyProfileId) {
  let query = `SELECT j.*, l.locationName,(select count(*) FROM job_applications WHERE job_applications.JobId = j.id) as application,(select count(*) FROM job_applications WHERE job_applications.JobId = j.id and job_applications.hired=1) as hired FROM jobs j left join locations l on j.LocationId = l.id  WHERE j.CompanyProfileId='${companyProfileId}' limit ${offset} ,${limit}`;
  return sequelize.query(
    query,
    { type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.log(err));

}


async function getAllCompanyJob(compId){
  return await Job.findAll({where: { compId,active:1}}).catch(err => console.log(err));
}
async function addJob(job) {
  return await Job.create(job).catch(err => console.log(err));
}

function addJobApplication(jobApplication) {
  return JobApplication.create(jobApplication).catch(err => console.log(err));
}

async function editJobById(id, newJob) {
  const job = await Job.findOne({ where: { id } }).catch(err =>
    console.log(err)
  );
  return await job.update(newJob).catch(err => console.log(err));
}

async function getJobById(id) {
  return Job.findOne({
    where: { id, active: 1 },
    include: [{ model: CompanyProfile }, { model: Location, include: [{model: City}, {model: Region}] }]
  }).catch(err => console.log(err));
}

function updateJobsField(value, fieldName, jobId){
  return Job.update({[fieldName]: value},{where: {id: jobId}});
}

async function getHiredApplicant(ApplicantProfileId, jobId) {
  return JobApplication.findOne({
    where: { ApplicantProfileId, jobId }
  }).catch(err => console.log(err));
}

function getApplicationByProfileIdAndJobId(JobId, ApplicantProfileId) {
  return JobApplication.findOne({
    where: { JobId, ApplicantProfileId }
  }).catch(err => console.log(err));
}

function getApplicantApplications(ApplicantProfileId) {
  return JobApplication.findAll({
    where: { ApplicantProfileId },
    include: [
      { model: CompanyProfile },
      { model: ApplicantProfile },
      { model: Job }
    ]
  }).catch(err => console.log(err));
}

function getEmployerJobApplications(JobId, CompanyProfileId) {
  return JobApplication.findAll({
    where: { JobId, CompanyProfileId },
    include: [
      { model: CompanyProfile },
      { model: ApplicantProfile },
      { model: Job }
    ]
  }).catch(err => console.log(err));
}

function getCompanyAllApplicant(offset, limit, CompanyProfileId) {
  return JobApplication.findAndCountAll({
    where: { CompanyProfileId },
    offset,
    limit,
    include: [
      { model: CompanyProfile },
      { model: ApplicantProfile },
      { model: Job }
    ]
  }).catch(err => console.log(err));
}

function getJobsWithApplications(CompanyProfileId, offset, limit) {
  return sequelize.query(
    `SELECT * FROM view_job_applications WHERE CompanyProfileId='${CompanyProfileId}' order by applicationStartDate DESC LIMIT ${limit} offset ${offset}`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

function getCountJobsWithApplication(CompanyProfileId) {
  return sequelize.query(
    `SELECT COUNT(*) FROM view_job_applications AS count WHERE CompanyProfileId='${CompanyProfileId}' `
  );
}

function getFilteredJobsWithApplications(CompanyProfileId, offset, limit) {
  return sequelize.query(
    `SELECT * FROM view_filtered_job_applications WHERE CompanyProfileId='${CompanyProfileId}' order by applicationStartDate DESC  LIMIT ${limit} offset ${offset}`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

function getCountFilteredJobsWithApplication(CompanyProfileId) {
  return sequelize.query(
    `SELECT COUNT(*) FROM view_filtered_job_applications AS count WHERE CompanyProfileId='${CompanyProfileId}' `
  );
}

function getJobApplications(JobId) {
  return JobApplication.findAll({
    where: { JobId },
    include: [{ model: ApplicantProfile }]
  }).catch(err => console.log(err));
}

function getApplicantById(applicantId) {
  return ApplicantProfile.findOne({ where: { id: applicantId } });
}

function getJobApplicants(jobId, offset, limit) {
  return sequelize.query(
    `SELECT a.id, a.currentEmployer, a.gender, a.dateOfBirth, a.address, a.applicantPicture, u.email, u.firstName, u.lastName, ja.createdAt from job_applications ja LEFT JOIN applicant_profiles a ON a.id = ja.applicantProfileId LEFT JOIN users u ON u.id = a.userId where ja.jobId = '${jobId}' order by ja.createdAt DESC LIMIT ${offset},${limit}`
  );
}

function getCountJobApplicants(jobId) {
  return sequelize.query(
    `SELECT count(*) from job_applications ja LEFT JOIN applicant_profiles a ON a.id = ja.applicantProfileId LEFT JOIN users u ON u.id = a.userId where ja.jobId = '${jobId}'`
  );
}

function getFilteredJobApplicants(jobId) {
  return sequelize.query(
    `SELECT a.id, a.currentEmployer, a.gender, a.dateOfBirth, a.address, a.applicantPicture, u.email, ja.id as applicationId, u.firstName, ja.createdAt, u.lastName from job_applications ja LEFT JOIN applicant_profiles a ON a.id = ja.applicantProfileId LEFT JOIN users u ON u.id = a.userId where ja.jobId = '${jobId}' AND ja.filtered = true`
  );
}

function getApplicantJobs(applicantId, offset, limit) {
  return sequelize.query(
    `SELECT * from view_applicant_applied_jobs where applicantProfileId = '${applicantId}' order by createdAt DESC LIMIT ${offset},${limit}`
  );
}

function getApplicantSavedJobs(applicantId, offset, limit) {
  return sequelize.query(
    `SELECT * from view_jobs_saved_review_later where applicantProfileId = '${applicantId}' order by createdAt DESC LIMIT ${offset},${limit} `
  );
}

function getAllSavedJobs(applicantId) {
  return sequelize.query(
    `SELECT * from view_jobs_saved_review_later where applicantProfileId = '${applicantId}' order by createdAt DESC`
  );
}
function countGetApplicantSavedJobs(applicantId) {
  return sequelize.query(
    `SELECT COUNT(*) from view_jobs_saved_review_later where applicantProfileId = '${applicantId}'`
  );
}

function countGetApplicantAppliedJobs(applicantId) {
  return sequelize.query(
    `SELECT COUNT(*) from view_applicant_applied_jobs where applicantProfileId = '${applicantId}'`
  );
}

function getCitySearch(search) {
  //const region= sequelize.query('select * from cities')
  return City.findAll({
    where: { cityName: { [Op.like]: search + "%" } },
    include: [{ model: Region, attributes: ["regionName", "id"] }],
    attributes: ["cityName", "id"]
  }).catch(err => console.log(err));
  //return sequelize.query(`select * from cities where cityName like '${search}%'`,{ type: sequelize.QueryTypes.SELECT })
}

function getCompanySearch(search) {
  return CompanyProfile.findAll({
    where: {
      [Op.or]: [
        { companyName: { [Op.like]: search + "%" } },
        { companyDescription: { [Op.like]: "%" + search + "%" } },
        { industryType: { [Op.like]: search + "%" } }
      ]
    },
    attributes: ["id", "companyName", "companyDescription", "industryType"]
  }).catch(err => console.log(err));

  //return sequelize.query(`select * from company_profiles where companyName like '${search}%'`, { type: sequelize.QueryTypes.SELECT })
}

function getJobsSearch(search) {
  return Job.findAll({
    where: {
      [Op.or]: [
        { jobTitle: { [Op.like]: search + "%" } },
        { jobDescription: { [Op.like]: "%" + search + "%" } },
        { industry: { [Op.like]: search + "%" } }
      ]
    },
    attributes: ["id", "jobTitle", "jobDescription", "industry"]
  }).catch(err => console.log(err));
}

// function countsearchInCity(search,cityName){
//     return sequelize.query(`SELECT COUNT(*) FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%' or industryType like '${search}%')`,{ type: sequelize.QueryTypes.SELECT})
// }

// function countsearchAll(search,cityName){
//     return sequelize.query(`SELECT COUNT(*) FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%' or industryType like '${search}%')`,{ type: sequelize.QueryTypes.SELECT})
// }

// function countsearchAllInCity(search,cityName){
//     return sequelize.query(`SELECT COUNT(*) FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%' or industryType like '${search}%')`,{ type: sequelize.QueryTypes.SELECT})
// }

// function searchInCity(search,cityName,offset, limit){
//     return sequelize.query(`SELECT * FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%' or industryType like '${search}%') order by createdAt DESC  LIMIT ${offset},${limit}`,{ type: sequelize.QueryTypes.SELECT })
// }

// function searchInAll(search,offset, limit){
//     return sequelize.query(`SELECT *  FROM view_companies_jobs_search WHERE (industry like '%${search}%') or (companyName like '%${search}%') OR (jobTitle like '%${search}%') or (employmentType	like '${search}%') OR companyDescription like '%${search}%'  order by createdAt DESC LIMIT ${offset},${limit}`,{ type: sequelize.QueryTypes.SELECT })
// }

// function searchAllInCity(cityName,offset, limit){
//     return sequelize.query(`SELECT * FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' order by createdAt DESC LIMIT ${offset},${limit}`,{ type: sequelize.QueryTypes.SELECT })
// }

// function searchAll(offset, limit){
//     return sequelize.query(`SELECT *  FROM view_companies_jobs_search order by createdAt DESC LIMIT ${offset},${limit}`,{ type: sequelize.QueryTypes.SELECT })
// }

function getJobsInLocations(latitude, longitude, distance) {
  return sequelize.query(
    `SELECT *, ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) AS distance FROM view_companies_jobs_search HAVING distance < ${distance} ORDER BY distance LIMIT 0 , 20;`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

function getJobsInLocationsByKey(search, latitude, longitude, distance) {
  return sequelize.query(
    `SELECT *, ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) AS distance FROM view_companies_jobs_search WHERE (industry like '%${search}%') or (jobTitle like '%${search}%') or (companyName like '${search}%') or (companyDescription like '%${search}%') or (cityName like '%${search}%') HAVING distance < ${distance} ORDER BY distance LIMIT 0 , 20;`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

function getAllApplications(offset, limit) {
  return sequelize.query(
    `SELECT * from view_job_applications_applicant order by createdAt DESC LIMIT ${offset},${limit}`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

// function getAllApplications(offset, limit){
//     return JobApplication.findAndCountAll({limit, offset, include: [{ model: CompanyProfile }, {model: Job}, {model: ApplicantProfile}, {model: User}]});
// }

function getAllApplicationsCount() {
  return sequelize.query(
    `SELECT COUNT(*) from view_job_applications_applicant`,
    { type: sequelize.QueryTypes.SELECT }
  );
}
function getCompanyApplications(compId, offset, limit) {
  return sequelize.query(
    `SELECT * from view_job_applications_applicant where companyProfileId='${compId}' order by createdAt DESC LIMIT ${offset},${limit}`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

function getCompanyApplicationsCount(compId) {
  return sequelize.query(
    `SELECT COUNT(*) from view_job_applications_applicant where companyProfileId='${compId}'`,
    { type: sequelize.QueryTypes.SELECT }
  );
}

function saveJobForLaterReview(ApplicantProfileId, JobId) {
  return JobLaterReview.create({ ApplicantProfileId, JobId }).catch(err =>
    console.log(err)
  );
}

function getSavedJob(ApplicantProfileId, JobId) {
  return JobLaterReview.findOne({ where: { JobId, ApplicantProfileId } });
}

function removeJobFromLaterReview(ApplicantProfileId, JobId) {
  return JobLaterReview.destroy({ where: { JobId, ApplicantProfileId } });
}

function updateJobApplication(jobApplication, body) {
  return jobApplication.update(body);
}

function executeSearchQuery(query) {
  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
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
  getFilteredJobApplicants,
  getFilteredJobsWithApplications,
  updateJobApplication,
  getCountJobsWithApplication,
  getCountFilteredJobsWithApplication,
  getCitySearch,
  getCompanySearch,
  getJobsSearch,
  getJobsInLocations,
  getJobsInLocationsByKey,
  getCompanyAllApplicant,
  getHiredApplicant,
  executeSearchQuery,
  getAllApplications,
  getAllApplicationsCount,
  getCompanyApplications,
  getCompanyApplicationsCount,
  countGetApplicantAppliedJobs,
  countGetApplicantSavedJobs,
  getAllSavedJobs,
  updateJobsField,
  getCountJobApplicants,
  getAllCompanyJob,
  getCompanyJobswithThierApplication,
  getAllPwdJobs
  // getApplicantApplication
};
