const {
    Job,
    CompanyProfile
} = require('../models');

async function getJobsWithOffsetAndLimit(offset, limit){
    return await Job.findAndCountAll({offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}


module.exports = {
    getJobsWithOffsetAndLimit
}