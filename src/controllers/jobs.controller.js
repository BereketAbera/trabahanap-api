const jobsService = require('../services/job.service');
const userService = require('../services/user.service');
const ROLE = require('../_helpers/role');

const {
    validateJob
} = require('../_helpers/validators');

function getAllJobs(req, res, next){
    getJobsWidthPagination(req.query.page || 1)
        .then(jobs => res.status(200).send({success: true, jobs}))
        .catch(err => next(err));
}

async function getJobsWidthPagination(page){
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
        pager.totalPages = jobs.count/pager.pageSize;
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

async function addEmployerJob(body){
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    console.log(user);
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

module.exports = {
    getAllJobs,
    addJob
}