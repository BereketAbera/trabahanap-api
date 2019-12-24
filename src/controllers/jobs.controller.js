const jobsService = require('../services/job.service');
const userService = require('../services/user.service');
const ROLE = require('../_helpers/role');
const _ = require('lodash');

const {
    validateJob
} = require('../_helpers/validators');

function getAllJobs(req, res, next) {
    getJobsWithPagination(req.query.page || 1)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}

function getJob(req, res, next) {
    getJobById(req.params.id)
        .then(job => res.status(200).send({ success: true, job }))
        .catch(err => next(err));
}

function getApplicantJob(req, res, next) {
    getApplicantJobById(req.params.id, req.user.sub)
        .then(job => res.status(200).send({ success: true, job }))
        .catch(err => next(err));
}

function getAllCompanyJobs(req, res, next) {
    getCompanyJobsWithPagination(req.query.page || 1, req.query.pageSize || 8, req.user.sub)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}

function adminGetAllCompanyJob(req, res, next) {
    adminGetCompanyJobsWithPagination(req.query.page || 1, req.query.pageSize || 8, req.params.companyProfileId)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}

function adminGetAllCompanyJobFilters(req, res, next) {
    adminFilterJobsPagination(req.query.industry || '', req.query.et || '', req.query.salary || '', req.query.search || '', req.query.page || 1)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}

function adminGetAllJobs(req, res, next) {
    getJobsWithPagination(req.query.page || 1)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}





function addJob(req, res, next) {
    const valid = validateJob(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    addEmployerJob({ ...req.body, user_id: req.user.sub })
        .then(job => job ? res.status(200).json({ success: true, job }) : res.status(200).json({ success: false, error: 'something is wrong' }))
        .catch(err => next(err));

}

function adminAddJob(req, res, next) {
    const valid = validateJob(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }
    const companyProfileId = req.params.companyProfileId;
    addCompanyJob(req.body, companyProfileId)
        .then(job => job ? res.status(200).json({ success: true, job }) : res.status(200).json({ success: false, error: 'something is wrong' }))
        .catch(err => next(err));
}

function editJob(req, res, next) {
    const valid = validateJob(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    editEmployerJob({ ...req.body, user_id: req.user.sub, id: req.params.id })
        .then(job => job ? res.status(200).json({ success: true, job }) : res.status(200).json({ success: false, error: 'something is wrong' }))
        .catch(err => next(err));

}

function applyJob(req, res, next) {
    addJobApplication({ ...req.body, user_id: req.user.sub })
        .then(response => response ? res.status(200).json({ success: true }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getApplicantApplications(req, res, next) {
    getUserApplicantApplications(req.user.sub)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getJobWithApplications(req, res, next) {
    getEmployerJobWithApplications(req.user.sub, req.query.page || 1, req.query.pageSize || 5)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getFilteredJobWithApplications(req, res, next) {
    getEmployerFilteredJobWithApplications(req.user.sub, req.query.page || 1, req.query.pageSize || 5)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getJobApplicants(req, res, next) {
    getEmployerGetJobApplicants(req.params.id, req.user.sub)
        .then(applicants => applicants ? res.status(200).json({ success: true, applicants }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getFilteredJobApplicants(req, res, next) {
    getEmployerFilteredJobApplicants(req.params.id, req.user.sub)
        .then(applicants => applicants ? res.status(200).json({ success: true, applicants }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getJobApplicant(req, res, next) {
    getJobApplicantById(req.params.id)
        .then(applicant => applicant ? res.status(200).json({ success: true, applicant }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function isHired(req, res, next) {
    getIsHired(req.params.id)
        .then(applicant => applicant ? res.status(200).json({ success: true, applicant }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}
function getCompanyApplicant(req, res, next) {
    const companyProfileId = req.params.companyProfileId;
    console.log(companyProfileId);
    getCompanyApplicantWithPagination(req.query.page || 1, req.query.pageSize || 5, companyProfileId)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getApplicantAppliedJobs(req, res, next) {
    getApplicantJobs(req.user.sub)
        .then(jobs => jobs ? res.status(200).json({ success: true, jobs }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function saveForLaterReview(req, res, next) {
    saveJobForLaterReview(req.user.sub, req.body.JobId)
        .then(success => res.status(200).json({ success }))
        .catch(err => next(err));
}

function getJobsLaterReview(req, res, next) {
    getApplicantLaterReviewJobs(req.user.sub)
        .then(jobs => jobs ? res.status(200).json({ success: true, jobs }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}



function filterJobApplication(req, res, next) {
    filterApplication(req.user.sub, jobId = req.body.jobId, applicantId = req.body.applicantId)
        .then(success => res.status(200).json({ success }))
        .catch(err => next(err));
}

function hireJobApplication(req, res, next) {
    hireApplication(req.user.sub, jobId = req.body.jobId, applicantId = req.body.applicantId)
        .then(success => res.status(200).json({ success }))
        .catch(err => next(err));
}

function editCompanyJob(req, res, next) {
    const valid = validateJob(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    adminEditJob({ ...req.body, id: req.params.id })
        .then(job => job ? res.status(200).json({ success: true, job }) : res.status(200).json({ success: false, error: 'something is wrong' }))
        .catch(err => next(err));
}

function searchCities(req, res, next) {
    searchAllCities(req.query.search)
        .then(cities => cities ? res.status(200).json({ success: true, cities }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function searchByCity(req, res, next) {
    getSearchInCity(req.query.key || '', req.query.city || '', req.query.page || 1)
        .then(jobs => jobs ? res.status(200).json({ success: true, jobs }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function searchByLocation(req, res, next) {
    searchJobsByLocation(req.query.key || '', req.query.lat, req.query.long, req.query.distance || 5)
        .then(jobs => jobs ? res.status(200).json({ success: true, jobs }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getAllApplications(req, res, next) {
    getAllApplicationsWithPaginations(req.query.page || 1)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function adminGetAllApplicationsFilters(req, res, next) {
    adminFilterApplicationsPagination(req.query.applicant || '', req.query.job || '', req.query.company || '', req.query.hired || '', req.query.page || 1)
        .then(jobs => res.status(200).send({ success: true, jobs }))
        .catch(err => next(err));
}



async function adminFilterApplicationsPagination(applicantName,jobTitle,companyName,hired,page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    queryResult = filterApplicationsBuilder(applicantName || '', jobTitle || '', companyName || '', hired | '', offset || 0, limit|| 6);
    console.log(queryResult)
    const jobs = await jobsService.executeSearchQuery(queryResult.selectQuery);
    if (jobs) {
        counts = await jobsService.executeSearchQuery(queryResult.count);
        if (counts) {
            pager.totalItems = Object.values(counts[0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
        }
        return {
            pager,
            rows: jobs
        };
    }

}



async function getJobsWithPagination(page) {
    const pager = {
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const jobs = await jobsService.getJobsWithOffsetAndLimit(offset, limit);

    if (jobs) {
        pager.totalItems = jobs.count;
        pager.totalPages = Math.ceil(jobs.count / pager.pageSize);
        return {
            pager,
            rows: jobs.rows
        }
    }
}



async function getCompanyJobsWithPagination(page, pageSize, user_id) {
    const pager = {
        pageSize: parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const user = await userService.getUserById(user_id);
    const jobs = await jobsService.getCompanyJobsWithOffsetAndLimit(offset, limit, user.companyProfileId);

    if (jobs) {
        pager.totalItems = jobs.count;
        pager.totalPages = Math.ceil(jobs.count / pager.pageSize);
        return {
            pager,
            rows: jobs.rows
        }
    }
}

async function adminGetCompanyJobsWithPagination(page, pageSize, companyProfileId) {
    const pager = {
        pageSize: parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    // const user = await userService.getUserById(user_id);
    const jobs = await jobsService.getCompanyJobsWithOffsetAndLimit(offset, limit, companyProfileId);

    if (jobs) {
        pager.totalItems = jobs.count;
        pager.totalPages = Math.ceil(jobs.count / pager.pageSize);
        return {
            pager,
            rows: jobs.rows
        }
    }
}

async function adminFilterJobsPagination(industry, employType, salaryRange, search, page) {
    const pager = {
        pageSize: 8,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    if (search == "undefined") {
        search = '';
    }
    if (industry == "undefined") {
        industry = '';
    } if (employType == "undefined") {
        employType = '';
    }
    if (salaryRange == "undefined") {
        salaryRange = '';
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    queryResult = FiltersJobQueryBuilder(search, employType, industry, salaryRange, offset, limit);
    console.log(queryResult)
    const jobs = await jobsService.executeSearchQuery(queryResult.selectQuery);
    if (jobs) {
        counts = await jobsService.executeSearchQuery(queryResult.count);
        if (counts) {
            pager.totalItems = Object.values(counts[0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
        }
        return {
            pager,
            rows: jobs
        };
    }
}

async function getAllApplicationsWithPaginations(page) {

    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const applications = await jobsService.getAllApplications(offset, limit);
    //console.log(applications)
    if (applications) {

        const applicationsCount = await jobsService.getAllApplicationsCount();
        if (applicationsCount) {
            pager.totalItems = Object.values(applicationsCount[0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
        }

        return {
            pager,
            rows: applications
        };
    }
}

async function getSearchInCity(search, cityName, page) {

    const pager = {
        pageSize: 8,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;


    if (cityName == '' && search == '') {
        //console.log('BOTH NO')
        const jobs = await jobsService.searchAll(offset, limit);
        //console.log(jobs)
        if (jobs) {

            const jobscount = await jobsService.getJobsWithOffsetAndLimit(offset, limit);
            console.log(jobscount)
            pager.totalItems = jobscount.count;
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
            return {
                pager,
                rows: jobs
            };
        }
    } else if (cityName == '' && !(search == '')) {
        //console.log("no city")
        const jobs = await jobsService.searchInAll(search, offset, limit);
        if (jobs) {
            const jobscount = await jobsService.countsearchAll(search, cityName);
            pager.totalItems = Object.values(jobscount[0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
            return {
                pager,
                rows: jobs
            };
        }
    } else if (cityName != '' && (search == '')) {
        //console.log("no search")
        const jobs = await jobsService.searchAllInCity(cityName, offset, limit);
        if (jobs) {
            const jobscount = await jobsService.countsearchAllInCity(search, cityName);
            pager.totalItems = Object.values(jobscount[0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
            return {
                pager,
                rows: jobs
            };
        }

    } else if (cityName != '' && (search != '')) {
        //console.log(cityName)
        //console.log('both')
        const jobs = await jobsService.searchInCity(search, cityName, offset, limit);
        const jobscount = await jobsService.countsearchInCity(search, cityName);
        pager.totalItems = Object.values(jobscount[0])[0];
        pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
        if (jobs) {
            return {
                pager,
                rows: jobs
            };
        }
    }
    else {
        return {};
    }
}

async function searchJobsByLocation(key, latitude, longitude, distance) {
    //console.log(`${key}, ${latitude},${longitude},${distance}`);
    //console.log(key)
    if (latitude != undefined && longitude != undefined) {

        if (key == "" || key == null) {

            const jobs = await jobsService.getJobsInLocations(latitude, longitude, distance)
            if (jobs) {
                return jobs;
            }
        }
        if (key != "" && key != undefined) {

            const jobs = await jobsService.getJobsInLocationsByKey(key, latitude, longitude, distance)
            return jobs;
        } else {
            return {}
        }

    }
    else {
        return {};
    }
}

async function searchAllCities(city) {
    const cities = await jobsService.getCitySearch(city);
    if (cities) {
        return cities;
    }
}

async function getJobById(id) {
    return await jobsService.getJobById(id);
}

async function getApplicantJobById(jobId, userId) {
    const job = await jobsService.getJobById(jobId);
    const applicantProfile = await userService.getApplicantProfileByUserId(userId);
    // console.log(jobId, userId);
    if (job && applicantProfile) {
        // console.log(job);
        const applied = await jobsService.getApplicationByProfileIdAndJobId(jobId, applicantProfile.id);

        const saved = await jobsService.getSavedJob(applicantProfile.id, jobId);
        const newJob = { ...job.dataValues, applied: applied ? true : false, appliedDate: applied ? applied.applicationDate : null, saved: saved ? true : false };

        return newJob;
    }
}

async function addEmployerJob(body) {
    const user = await userService.getUserById(body.user_id);

    if (user) {

        const compProfileId = user.company_profile.id;
        //console.log(compProfileId)
        if (compProfileId) {
            const job = await jobsService.addJob({ ...body, companyProfileId: compProfileId });
            if (job) {

                return job;
            }
        }
    }
}


async function addCompanyJob(body, compProfileId) {
    const job = await jobsService.addJob({ ...body, companyProfileId: compProfileId });
    if (job) {
        return job;
    }
}


async function editEmployerJob(body) {
    const user = await userService.getUserByIdAndRole(body.user_id, ROLE.EMPLOYER);
    const job = await jobsService.getJobById(body.id);
    if (user && job) {
        const updatedJob = jobsService.editJobById(job.id, body);
        if (updatedJob) {
            return updatedJob;
        }
    }
}

async function adminEditJob(body) {
    const job = await jobsService.getJobById(body.id);
    if (job) {
        const updatedJob = jobsService.editJobById(job.id, body);
        if (updatedJob) {
            return updatedJob;
        }
    }
}

async function addJobApplication(body) {
    const job = await jobsService.getJobById(body.JobId);
    const applicantProfile = await userService.getApplicantProfileByUserId(body.user_id);

    if (job && applicantProfile) {
        const applied = await jobsService.getApplicationByProfileIdAndJobId(job.id, applicantProfile.id);
        if (applied) {
            return false;
        }
        const jobApplication = jobsService.addJobApplication({ JobId: job.id, ApplicantProfileId: applicantProfile.id, CompanyProfileId: job.CompanyProfileId, applicationDate: new Date() });
        if (jobApplication) {
            return true;
        }
    }
    return false;
}

async function getUserApplicantApplications(user_id) {
    const applicantProfile = await userService.getApplicantProfileByUserId(user_id);
    if (applicantProfile) {
        const applications = await jobsService.getApplicantApplications(applicantProfile.id);
        if (applications) {
            return applications;
        }
    }

    return false;
}

async function getCompanyApplicantWithPagination(page, pageSize, compProfileId) {
    const pager = {
        pageSize: parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const applications = await jobsService.getCompanyAllApplicant(offset, limit, compProfileId);
    console.log(applications)
    if (applications) {
        return applications;
    }
}

async function getEmployerJobWithApplications(user_id, page, pageSize) {
    const pager = {
        pageSize: parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const user = await userService.getUserById(user_id);
    if (user) {

        const jobWithApplications = await jobsService.getJobsWithApplications(user.companyProfileId, offset, limit).catch(err => console.log(err));;
        const jobscount = await jobsService.getCountJobsWithApplication(user.companyProfileId);

        if (jobWithApplications) {
            pager.totalItems = Object.values(jobscount[0][0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);

            return {
                pager,
                rows: jobWithApplications
            }
        }
        // const applications = await jobsService.getEmployerJobApplications(JobId, user.companyProfileId);
        // if(applications){
        //     return applications;
        // }
    }

    return false;
}

async function getEmployerFilteredJobWithApplications(user_id, page, pageSize) {
    const user = await userService.getUserById(user_id);
    const pager = {
        pageSize: parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    if (user && user.companyProfileId) {
        const jobscount = await jobsService.getCountFilteredJobsWithApplication(user.companyProfileId);
        const jobWithApplications = await jobsService.getFilteredJobsWithApplications(user.companyProfileId, offset, limit);
        if (jobWithApplications) {
            pager.totalItems = Object.values(jobscount[0][0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);

            return {
                pager,
                rows: jobWithApplications
            }
        }
        // const applications = await jobsService.getEmployerJobApplications(JobId, user.companyProfileId);
        // if(applications){
        //     return applications;
        // }
    }

    return false;
}

async function getEmployerGetJobApplicants(jobId, userId) {
    const user = await userService.getUserById(userId);
    const job = await jobsService.getJobById(jobId);

    if (user && job && user.companyProfileId == job.companyProfileId) {
        const applicants = await jobsService.getJobApplicants(jobId);
        if (applicants[0]) {
            return applicants[0];
        }
    }
}

async function getEmployerFilteredJobApplicants(jobId, userId) {
    const user = await userService.getUserById(userId);
    const job = await jobsService.getJobById(jobId);

    if (user && job && user.companyProfileId == job.companyProfileId) {
        const applicants = await jobsService.getFilteredJobApplicants(jobId);
        if (applicants[0]) {
            //console.log(applicants);
            return applicants[0];
        }
    }
}

async function getIsHired(applicantId) {
    const hiredApplicant = await jobsService.getHiredApplicant(applicantId);
    if (hiredApplicant) {
        return { hired: hiredApplicant.hired }
    }

}

async function getJobApplicantById(applicantId) {
    let applicant = await userService.getApplicantById(applicantId);
    if (applicant) {
        return applicant;
    }
}

async function getApplicantJobs(userId) {
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if (applicant) {
        const jobs = await jobsService.getApplicantJobs(applicant.id);
        if (jobs[0]) {
            return jobs[0];
        }
    }

}

async function saveJobForLaterReview(userId, jobId) {
    const applicant = await userService.getApplicantProfileByUserId(userId);
    const job = await jobsService.getJobById(jobId);
    // console.log(job, applicant);
    if (applicant && job) {
        const alreadySaved = await jobsService.getSavedJob(applicant.id, job.id)
        if (alreadySaved) {
            const remove = await jobsService.removeJobFromLaterReview(applicant.id, job.id);
            if (remove) {
                return true;
            }
        } else {
            const saved = await jobsService.saveJobForLaterReview(applicant.id, job.id);
            if (saved) {
                return true;
            }
        }
    }
    return false;
}

async function getApplicantLaterReviewJobs(userId) {
    const applicant = await userService.getApplicantProfileByUserId(userId);

    if (applicant) {
        const applications = await jobsService.getApplicantApplications(applicant.id);
        const jobs = await jobsService.getApplicantSavedJobs(applicant.id);
        if (jobs[0] && applications) {
            const applicationIds = applications.map(application => {
                return application.JobId;
            })
            const unappliedSavedJobs = jobs[0].filter(job => {
                return !applicationIds.includes(job.id);
            })
            if (unappliedSavedJobs) {
                return unappliedSavedJobs;
            }
        }
    }
}

async function hireApplication(userId, jobId, applicantId) {
    const user = await userService.getUserById(userId);
    const job = await jobsService.getJobById(jobId);
    const applicant = await userService.getApplicantById(applicantId);
    //console.log(user,job,applicant)
    if (user && job && applicant && user.company_profile && user.applicantPRofileId == job.companyProfileId.id) {
        console.log('from Hire application');
        const jobApplication = await jobsService.getApplicationByProfileIdAndJobId(jobId, applicantId);

        if (jobApplication) {
            console.log(jobApplication.hired)
            if (!jobApplication.hired) {
                const hired = await jobsService.updateJobApplication(jobApplication, { hired: true });
                //console.log(hired,'hired')
                if (hired) {
                    return hired;
                }
            } else {
                const hired = await jobsService.updateJobApplication(jobApplication, { hired: false });
                if (hired) {
                    return hired;
                }
            }
        }
    }

    return false;
}

async function filterApplication(userId, jobId, applicantId) {
    const user = await userService.getUserById(userId);
    const job = await jobsService.getJobById(jobId);
    const applicant = await userService.getApplicantById(applicantId);
    if (user && job && applicant && user.company_profile && user.applicantPRofileId == job.companyProfileId.id) {
        console.log('from filter application');
        const jobApplication = await jobsService.getApplicationByProfileIdAndJobId(jobId, applicantId);
        if (jobApplication) {
            if (!jobApplication.filtered) {
                const filtered = await jobsService.updateJobApplication(jobApplication, { filtered: true });
                if (filtered) {
                    return true;
                }
            } else {
                const filtered = await jobsService.updateJobApplication(jobApplication, { filtered: false });
                if (filtered) {
                    return true;
                }
            }
        }
    }

    return false;
}


function FiltersJobQueryBuilder(search, employType, industry, salaryRange, offset, limit) {
    let query = ``;
    let haveWhere = false;
    if (employType != "") {
        query = query + ` where employmentType='${employType}'`;
        haveWhere = true;
    } if (industry != "") {
        if (haveWhere) {
            query = query + ` and industry='${industry}'`;
        } else {
            query = query + ` where industry='${industry}'`;
            haveWhere = true;
        }
    }
    if (salaryRange != "") {
        if (haveWhere) {
            query = query + ` and salaryRange='${salaryRange}'`;
        } else {
            query = query + ` where salaryRange='${salaryRange}'`;
            haveWhere = true;
        }
    }
    if (haveWhere) {
        query = query + ` and (jobTitle like '%${search}%' or companyName like '${search}%')`;
    } else {
        query = query + ` where (jobTitle like '%${search}%' or companyName like '${search}%')`;
    }
    let selectQuery = `select * from view_companies_jobs_search ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM view_companies_jobs_search`;
    return { selectQuery: selectQuery, count: QueryCount };
}

function filterApplicationsBuilder(applicantName, jobTitle,companyName, hired, offset, limit) {
    let query = ``;
    let haveWhere = false;
    if (applicantName != "") {
        query = query + ` where (firstName like '%${applicantName}%' or lastName like '%${applicantName}%')`;
        haveWhere = true;
    } if (jobTitle != "") {
        if (haveWhere) {
            query = query + ` and jobTitle like '%${jobTitle}%'`;
        } else {
            query = query + ` where jobTitle like '%${jobTitle}%'`;
            haveWhere = true;
        }
    }
    if (companyName != "") {
        if (haveWhere) {
            query = query + ` and companyName like '%${companyName}%'`;
        } else {
            query = query + ` where companyName like '%${companyName}%'`;
            haveWhere = true;
        }
    }
    if (hired != "") {
        if (haveWhere) {
            query = query + ` and hired='${hired}'`;
        } else {
            query = query + ` where hired='${hired}'`;
            haveWhere = true;
        }
    }
    let selectQuery = `select * from view_job_applications_applicant ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM view_job_applications_applicant` + query;
    return { selectQuery: selectQuery, count: QueryCount };
}

module.exports = {
    getAllJobs,
    addJob,
    adminAddJob,
    getAllCompanyJobs,
    editJob,
    getJob,
    applyJob,
    getApplicantApplications,
    getJobWithApplications,
    getApplicantJob,
    getJobApplicants,
    getJobApplicant,
    getApplicantAppliedJobs,
    saveForLaterReview,
    getJobsLaterReview,
    getFilteredJobApplicants,
    getFilteredJobWithApplications,
    filterJobApplication,
    adminGetAllCompanyJob,
    editCompanyJob,
    adminGetAllJobs,
    searchByCity,
    searchByLocation,
    searchCities,
    getCompanyApplicant,
    hireJobApplication,
    isHired,
    adminGetAllCompanyJobFilters,
    getAllApplications,
    adminGetAllApplicationsFilters

}