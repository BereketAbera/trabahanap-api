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

function adminGetAllEmployersFilters(req, res, next) {
    adminFilterEmployersPagination(req.query.companyName || '', req.query.industry || '', req.query.page || 1)
        .then(companies => res.status(200).send({ success: true, companies }))
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

function filterJobsApplications(req, res, next) {
    filterAllJobsApplicationsWithPaginations(req.user.sub, req.query.job, req.query.industry, req.query.position, req.query.page || 1)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function filterAllFilteredJobsApplications(req, res, next) {
    filterAllFilteredJobsApplicationsWithPaginations(req.user.sub, req.query.job, req.query.industry, req.query.position, req.query.page || 1)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function getCompanyApplications(req, res, next) {
    getCompanyApplicationsWithPaginations(req.user.sub, req.query.page || 1)
        .then(applications => applications ? res.status(200).json({ success: true, applications }) : res.status(200).json({ sucess: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function filterAllJobs(req, res, next) {
    getFilterJobsWithPaginations(req.user.sub, req.query.job, req.query.industry, req.query.position, req.query.page || 1)
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
    getIsHired(req.params.id, req.params.jobId)
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
    getSearchInCity(req.query.key || '', req.query.cityName || '', req.query.page || 1)
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
    filterApplicationsPagination('', req.query.applicant || '', req.query.job || '', req.query.company || '', req.query.hired || '', req.query.page || 1)
        .then(applications => res.status(200).send({ success: true, applications }))
        .catch(err => next(err));
}

function adminGetAllApplicantFilters(req, res, next) {
    adminFilterApplicantsPagination(req.query.name || '', req.query.email || '', req.query.page || 1)
        .then(applicants => res.status(200).send({ success: true, applicants }))
        .catch(err => next(err));
}

function getFilterCompanyApplications(req, res, next) {
    filterApplicationsPagination(req.user.sub || '', req.query.applicant || '', req.query.job || '', req.query.company || '', req.query.hired || '', req.query.page || 1)
        .then(applications => res.status(200).send({ success: true, applications }))
        .catch(err => next(err));
}

async function getFilterJobsWithPaginations(user_id,jobtitle,industry,position,page){
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;


    const user = await userService.getUserById(user_id);
    if (user) {

        queryResult = filterEmployerJobsQueryBuilder(user.companyProfileId || '', jobtitle || '', industry || '', position || '', offset || 0, limit || 6);
        console.log(queryResult)
        const applications = await jobsService.executeSearchQuery(queryResult.selectQuery);
        if (applications) {
            counts = await jobsService.executeSearchQuery(queryResult.count);
            if (counts) {
                pager.totalItems = Object.values(counts[0])[0];
                pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
            }
            return {
                pager,
                rows: applications
            };
        }
    }
}

async function filterApplicationsPagination(user_id, applicantName, jobTitle, companyName, hired, page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;
    if (user_id != '') {
        const user = await userService.getUserById(user_id);

        if (user.companyProfileId) {
            queryResult = filterApplicationsBuilder(user.companyProfileId || '', applicantName || '', jobTitle || '', companyName || '', hired | '', offset || 0, limit || 6);
            //console.log(queryResult)
        }
    } else {
        queryResult = filterApplicationsBuilder('', applicantName || '', jobTitle || '', companyName || '', hired | '', offset || 0, limit || 6);
        //console.log(queryResult)
    }

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

async function adminFilterEmployersPagination(companyName, industry, page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    queryResult = filterEmployerQueryBuilder(companyName || '', industry || '', offset || 0, limit || 6);
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

async function adminFilterApplicantsPagination(name, email, page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    queryResult = filterApplicantQueryBuilder(name || '', email || '', offset || 0, limit || 6);
    console.log(queryResult)
    const applicants = await jobsService.executeSearchQuery(queryResult.selectQuery);
    if (applicants) {
        counts = await jobsService.executeSearchQuery(queryResult.count);
        if (counts) {
            pager.totalItems = Object.values(counts[0])[0];
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
        }
        return {
            pager,
            rows: applicants
        };
    }
}

async function filterAllFilteredJobsApplicationsWithPaginations(user_id, jobtitle, industry, position, page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;


    const user = await userService.getUserById(user_id);
    if (user) {

        queryResult = filterEmployerFilteredApplicantionsQueryBuilder(user.companyProfileId || '', jobtitle || '', industry || '', position || '', offset || 0, limit || 6);
        console.log(queryResult)
        const applications = await jobsService.executeSearchQuery(queryResult.selectQuery);
        if (applications) {
            counts = await jobsService.executeSearchQuery(queryResult.count);
            if (counts) {
                pager.totalItems = Object.values(counts[0])[0];
                pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
            }
            return {
                pager,
                rows: applications
            };
        }
    }

}
async function filterAllJobsApplicationsWithPaginations(user_id, jobtitle, industry, position, page) {
    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;


    const user = await userService.getUserById(user_id);
    if (user) {

        queryResult = filterEmployerApplicantionsQueryBuilder(user.companyProfileId || '', jobtitle || '', industry || '', position || '', offset || 0, limit || 6);
        console.log(queryResult)
        const applications = await jobsService.executeSearchQuery(queryResult.selectQuery);
        if (applications) {
            counts = await jobsService.executeSearchQuery(queryResult.count);
            if (counts) {
                pager.totalItems = Object.values(counts[0])[0];
                pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
            }
            return {
                pager,
                rows: applications
            };
        }
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

async function getCompanyApplicationsWithPaginations(user_id, page) {

    const pager = {
        pageSize: 6,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;
    const user = await userService.getUserById(user_id);
    if (user) {
        const applications = await jobsService.getCompanyApplications(user.companyProfileId, offset, limit);
        //console.log(applications)
        if (applications) {

            const applicationsCount = await jobsService.getCompanyApplicationsCount(user.companyProfileId);
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

}

async function getSearchInCity(search, cityName, page) {
    console.log(cityName, "city");
    const pager = {
        pageSize: 8,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    queryResult = searchQueryBuilder(search || '', cityName || '', offset, limit);
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

async function getIsHired(applicantId, jobId) {
    const hiredApplicant = await jobsService.getHiredApplicant(applicantId, jobId);
    console.log(hiredApplicant)
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

function searchQueryBuilder(search, cityName, offset, limit) {
    let query = ``;
    let haveWhere = false;
    //query = ` WHERE CompanyProfileId='${CompanyProfileId}'`;
    if (cityName != "") {
        query = query + ` where cityName like '%${cityName}%'`;
        haveWhere = true;
    } if (search != "") {
        if (haveWhere) {
            query = query + ` and (jobTitle like '%${search}%' or companyName like '%${search}%' or industryType like '%${search}%')`;
        } else {
            query = query + ` where (jobTitle like '%${search}%' or companyName like '%${search}%' or industryType like '%${search}%')`;
        }
    }
    let selectQuery = `select * from view_companies_jobs_search ` + query + `order by createdAt desc LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM view_companies_jobs_search` + query;
    return { selectQuery: selectQuery, count: QueryCount };
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

function filterApplicationsBuilder(compId = '', applicantName, jobTitle, companyName, hired, offset, limit) {
    let query = ``;
    let haveWhere = false;
    if (compId != '') {
        query = query + ` where companyProfileId='${compId}' `;
        haveWhere = true;
    }
    if (applicantName != "") {
        if (haveWhere) {
            query = query + ` and (firstName like '%${applicantName}%' or lastName like '%${applicantName}%')`;
        } else {
            query = query + ` where (firstName like '%${applicantName}%' or lastName like '%${applicantName}%')`;
            haveWhere = true;
        }

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

function filterEmployerQueryBuilder(companyName, industry, offset, limit) {
    let query = ``;
    let haveWhere = false;
    if (companyName != "") {
        query = query + ` where (companyName like '%${companyName}%' or companyDescription like '%${companyName}%')`;
        haveWhere = true;
    } if (industry != "") {
        if (haveWhere) {
            query = query + ` and industryType like '%${industry}%'`;
        } else {
            query = query + ` where industryType like '%${industry}%'`;
            haveWhere = true;
        }
    }

    let selectQuery = `select * from company_profiles ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM company_profiles` + query;
    return { selectQuery: selectQuery, count: QueryCount };
}

function filterApplicantQueryBuilder(name, email, offset, limit) {
    let query = ``;
    query = ` where role='APPLICANT'`;
    if (name != "") {
        query = query + ` and (firstName like '%${name}%' or lastName like '%${name}%')`;
    } if (email != "") {
        query = query + ` and email like '%${email}%'`;

    }
    let selectQuery = `select * from users ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM users` + query;
    return { selectQuery: selectQuery, count: QueryCount };
}

function filterEmployerApplicantionsQueryBuilder(CompanyProfileId, jobtitle, industry, position, offset, limit) {
    let query = ``;
    query = ` WHERE CompanyProfileId='${CompanyProfileId}'`;
    if (jobtitle != "") {
        query = query + ` and jobTitle like '%${jobtitle}%'`;
    } if (industry != "") {
        query = query + ` and industryType like '%${industry}%'`;

    } if (position != "") {
        query = query + ` and position like '%${position}%'`;

    }
    let selectQuery = `select * from view_job_applications ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM view_job_applications` + query;
    return { selectQuery: selectQuery, count: QueryCount };
}

function filterEmployerFilteredApplicantionsQueryBuilder(CompanyProfileId, jobtitle, industry, position, offset, limit) {
    let query = ``;
    query = ` WHERE CompanyProfileId='${CompanyProfileId}'`;
    if (jobtitle != "") {
        query = query + ` and jobTitle like '%${jobtitle}%'`;
    } if (industry != "") {
        query = query + ` and industryType like '%${industry}%'`;

    } if (position != "") {
        query = query + ` and position like '%${position}%'`;

    }
    let selectQuery = `select * from view_filtered_job_applications ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM view_filtered_job_applications` + query;
    return { selectQuery: selectQuery, count: QueryCount };
}

function filterEmployerJobsQueryBuilder(CompanyProfileId, jobtitle, industry, position, offset, limit) {
    let query = ``;
    query = ` WHERE CompanyProfileId='${CompanyProfileId}'`;
    if (jobtitle != "") {
        query = query + ` and jobTitle like '%${jobtitle}%'`;
    } if (industry != "") {
        query = query + ` and industry like '%${industry}%'`;

    } if (position != "") {
        query = query + ` and position like '%${position}%'`;

    }
    let selectQuery = `select * from jobs ` + query + ` LIMIT ${offset},${limit}`;
    let QueryCount = `SELECT COUNT(*) FROM jobs` + query;
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
    adminGetAllApplicationsFilters,
    adminGetAllEmployersFilters,
    adminGetAllApplicantFilters,
    filterJobsApplications,
    getCompanyApplications,
    getFilterCompanyApplications,
    filterAllFilteredJobsApplications,
    filterAllJobs
}