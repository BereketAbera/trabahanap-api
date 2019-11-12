const jobsService = require('../services/job.service');
const userService = require('../services/user.service');
const ROLE = require('../_helpers/role');

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

async function getJobById(id){
    return await jobsService.getJobById(id);
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

module.exports = {
    getAllJobs,
    addJob,
    getAllCompanyJobs,
    editJob,
    getJob
}