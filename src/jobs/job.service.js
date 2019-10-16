const {
    Job,
    CompanyProfile
} = require('../models');

async function getAllJobs(page){
    const pager = {
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page-1)*pager.pageSize;
    const limit = pager.pageSize;

    const jobs = await Job.findAndCountAll({offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));

    if(jobs){
        pager.totalItems = jobs.count;
        pager.currentPage = page;
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