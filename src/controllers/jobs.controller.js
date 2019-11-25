const jobsService = require('../services/job.service');
const userService = require('../services/user.service');
const ROLE = require('../_helpers/role');
const _ = require('lodash');

const {
    validateJob
} = require('../_helpers/validators');

function getAllJobs(req, res, next){
    getJobsWithPagination(req.query.page || 1)
        .then(jobs => res.status(200).send({success: true, jobs}))
        .catch(err => next(err));
}

function getJob(req, res, next){
    getJobById(req.params.id)
        .then(job => res.status(200).send({success: true, job}))
        .catch(err => next(err));
}

function getApplicantJob(req, res, next){
    getApplicantJobById(req.params.id, req.user.sub)
        .then(job => res.status(200).send({success: true, job}))
        .catch(err => next(err));
}

function getAllCompanyJobs(req, res, next){
    getCompanyJobsWithPagination(req.query.page || 1, req.query.pageSize || 8, req.user.sub)
        .then(jobs => res.status(200).send({success: true, jobs}))
        .catch(err => next(err));
}

async function getJobsWithPagination(page){
    const pager = {
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page-1)*pager.pageSize;
    const limit = pager.pageSize;

    const jobs = await jobsService.getJobsWithOffsetAndLimit(offset, limit);

    if(jobs){
        pager.totalItems = jobs.count;
        pager.totalPages = Math.ceil(jobs.count/pager.pageSize);
        return {
            pager,
            rows: jobs.rows
        }
    }
}

async function getCompanyJobsWithPagination(page, pageSize, user_id){
    const pager = {
        pageSize : parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page-1)*pager.pageSize;
    const limit = pager.pageSize;

    const user = await userService.getUserById(user_id);
    const jobs = await jobsService.getCompanyJobsWithOffsetAndLimit(offset, limit, user.companyProfileId);

    if(jobs){
        pager.totalItems = jobs.count;
        pager.totalPages = Math.ceil(jobs.count/pager.pageSize);
        return {
            pager,
            rows: jobs.rows
        }
    }
}

function addJob(req, res, next){
    const valid = validateJob(req.body);
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    addEmployerJob({...req.body, user_id: req.user.sub})
        .then(job => job ? res.status(200).json({success: true, job}) : res.status(200).json({ success: false, error: 'something is wrong'}))
        .catch(err => next(err));

}

function editJob(req, res, next){
    const valid = validateJob(req.body);
    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    editEmployerJob({...req.body, user_id: req.user.sub, id: req.params.id})
        .then(job => job ? res.status(200).json({success: true, job}) : res.status(200).json({ success: false, error: 'something is wrong'}))
        .catch(err => next(err));

}

function applyJob(req, res, next){
    addJobApplication({...req.body, user_id: req.user.sub})
        .then(response => response ? res.status(200).json({success: true}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function getApplicantApplications(req, res, next){
    getUserApplicantApplications(req.user.sub)
        .then(applications => applications ? res.status(200).json({success: true, applications}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function getJobWithApplications(req, res, next){
    getEmployerJobWithApplications(req.user.sub)
        .then(applications => applications ? res.status(200).json({success: true, applications}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function getJobApplicants(req, res, next){
    getEmployerGetJobApplicants(req.params.id, req.user.sub)
        .then(applicants => applicants ? res.status(200).json({success: true, applicants}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

function getJobApplicant(req, res, next){
    getJobApplicantById(req.params.id)
        .then(applicant => applicant ? res.status(200).json({success: true, applicant}) : res.status(200).json({sucess: false, error: 'Something went wrong'}))
        .catch(err => next(err));
}

async function getJobById(id){
    return await jobsService.getJobById(id);
}

async function getApplicantJobById(jobId, userId){
    const job = await jobsService.getJobById(jobId);
    const applicantProfile = await userService.getApplicantProfileByUserId(userId);
    // console.log(jobId, userId);
    if(job && applicantProfile){
        // console.log(job);
        const applied = await jobsService.getApplicationByProfileIdAndJobId(jobId, applicantProfile.id);
        const newJob = { ...job.dataValues, applied: applied ? true : false };

        return newJob;
    }
}

async function addEmployerJob(body){
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    if(user){
        
        const compProfileId = user.company_profile.id;
        if(compProfileId){
            const job = await jobsService.addJob({...body, companyProfileId: compProfileId});
            if(job){
                return job;
            }
        }
    }
}

async function editEmployerJob(body){
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    const job = await jobsService.getJobById(body.id);
    if(user && job){
        const updatedJob = jobsService.editJobById(job.id, body);
        if(updatedJob){
            return updatedJob;
        }
    }
}

async function addJobApplication(body){
    const job = await jobsService.getJobById(body.JobId);
    const applicantProfile = await userService.getApplicantProfileByUserId(body.user_id);
    
    if(job && applicantProfile){
        const applied = await jobsService.getApplicationByProfileIdAndJobId(job.id, applicantProfile.id);
        if(applied){
            return false;
        }
        const jobApplication = jobsService.addJobApplication({JobId: job.id, ApplicantProfileId: applicantProfile.id, CompanyProfileId: job.CompanyProfileId, applicationDate: new Date()});
        if(jobApplication){
            return true;
        }
    }
    return false;
}

async function getUserApplicantApplications(user_id){
    const applicantProfile = await userService.getApplicantProfileByUserId(user_id);
    if(applicantProfile){
        const applications = await jobsService.getApplicantApplications(applicantProfile.id);
        if(applications){
            return applications;
        }
    }

    return false;
}

async function getEmployerJobWithApplications(user_id){
    const user = await userService.getUserById(user_id);
    if(user && user.companyProfileId){
        const jobWithApplications = await jobsService.getJobsWithApplications(user.companyProfileId);
        // console.log(jobWithApplications);
        if(jobWithApplications){
            return jobWithApplications;
        }
        // const applications = await jobsService.getEmployerJobApplications(JobId, user.companyProfileId);
        // if(applications){
        //     return applications;
        // }
    }

    return false;
}

async function getEmployerGetJobApplicants(jobId, userId){
    const user = await userService.getUserById(userId);
    const job = await jobsService.getJobById(jobId);

    if(user && job && user.companyProfileId == job.companyProfileId){
        const applicants = await jobsService.getJobApplicants(jobId);
        if(applicants[0]){
            return applicants[0];
        }
    }
}

async function getJobApplicantById(applicantId){
    const applicant = await userService.getApplicantById(applicantId);

    if(applicant){
        return applicant;
    }
}

module.exports = {
    getAllJobs,
    addJob,
    getAllCompanyJobs,
    editJob,
    getJob,
    applyJob,
    getApplicantApplications,
    getJobWithApplications,
    getApplicantJob,
    getJobApplicants,
    getJobApplicant
}