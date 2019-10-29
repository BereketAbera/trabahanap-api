const jobsService = require('../services/job.service');

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


module.exports = {
    getAllJobs
}