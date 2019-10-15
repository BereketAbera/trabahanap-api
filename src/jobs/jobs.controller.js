const jobsService = require('./job.service');

function getAllJobs(req, res, next){
    jobsService.getAllJobs(req.query.page || 1)
        .then(jobs => res.status(200).send({success: true, jobs}))
        .catch(err => next(err));
}


module.exports = {
    getAllJobs
}