const {
    Job,
    CompanyProfile
} = require('../models');

async function getJobsWithOffsetAndLimit(offset, limit){
    return await Job.findAndCountAll({offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

async function getCompanyJobsWithOffsetAndLimit(offset, limit, companyProfileId){
    return await Job.findAndCountAll({where: {companyProfileId}, offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

async function addJob(job){
    return await Job.create(job).catch(err => console.log(err));
}

async function editJobById(id, newJob){
    const job = await Job.findOne({where: {id}}).catch(err => console.log(err));
    return await job.update(newJob).catch(err => console.log(err));
}

async function getJobById(id){
    return Job.findOne({where: {id}}).catch(err => console.log(err));
}


module.exports = {
    getJobsWithOffsetAndLimit,
    addJob,
    editJobById,
    getJobById,
    getCompanyJobsWithOffsetAndLimit
}