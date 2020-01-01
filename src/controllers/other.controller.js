const otherService = require('../services/other.service');
const userService = require('../services/user.service');
const jobsService = require('../services/job.service')
const ROLE = require('../_helpers/role');

const { validateIssue } = require('../_helpers/validators');
const constractStafferEmail = require('../_helpers/construct_staffer_email');
const uuidv4 = require('uuid/v4');
const sgMail = require('@sendgrid/mail');
const CONSTANTS = require('../../constants');
const bcryptjs = require('bcryptjs');
sgMail.setApiKey(CONSTANTS.SENDGRID_KEY);


function getAllIndustries(req, res, next) {
    getIndutries()
        .then(industries => res.status(200).send({ success: true, industries }))
        .catch(err => next(err));
}

function searchIndustry(req, res, next) {
    getSearchedIndustry(req.query.search)
        .then(industries => industries ? res.status(200).json({ success: true, industries }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function advancedSearchJob(req, res, next) {
    getAdvancedSearched(req.query.search || "", req.query.et || "", req.query.industry || "", req.query.sr || "", req.query.ct || "", req.query.page || 1)
        .then(jobs => jobs ? res.status(200).json({ success: true, jobs }) : res.status(200).json({ success: false, error: 'Something went wrong' }))
        .catch(err => next(err));
}

function addEmpIssue(req, res, next) {
    const valid = validateIssue(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    addEmployerIssue(req.body, req.user.sub)
        .then(issue => res ? res.status(200).send({ success: true, issue }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getEmpIssues(req, res, next) {
    getEmployerIssues(req.user.sub)
        .then(issues => issues ? res.status(200).send({ success: true, issues }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function addIssue(req, res, next) {
    const valid = validateIssue(req.body);
    if (valid != true) {
        res.status(200).json({ success: false, validationError: valid });
        return;
    }

    addApplicantIssue(req.body, req.user.sub)
        .then(issue => res ? res.status(200).send({ success: true, issue }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getIssues(req, res, next) {
    getApplicantIssues(req.user.sub)
        .then(issues => issues ? res.status(200).send({ success: true, issues }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getStaffs(req, res, next) {
    getEmployerStaffs(req.user.sub)
        .then(staffs => staffs ? res.status(200).send({ success: true, staffs }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getIssue(req, res, next) {
    getApplicantIssue(req.user.sub, req.params.id)
        .then(issue => issue ? res.status(200).send({ success: true, issue }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function addStaff(req, res, next) {
    addCompanyStaffer(req.body, req.user.sub)
        .then(success => res.status(200).send({ success }))
        .catch(err => next(err));
}

function addNewStaffer(req, res, next) {
    renderNewStafferPassword(req)
        .then(response => res.render('addNewStaffer', { layout: 'main', response }))
        .catch(err => next(err));
}

function addNewApplicant(req, res, next) {
    renderNewApplicantPassword(req)
        .then(response => res.render('addNewApplicant', { layout: 'main', response }))
        .catch(err => next(err));
}


function changeStafferPassword(req, res, next) {
    var response = { ...req.body, error: "", passwordChanged: false, processed: false };
    if (req.body.password.length < 5) {
        response.error = "Password must be at list 6 characters";
        res.render('addNewApplicant', { layout: 'main', response });
        return;
    } else if (req.body.password != req.body.comfirm_password) {
        response.error = "Passwords does not much";
        res.render('addNewApplicant', { layout: 'main', response });
        return;
    }

    // console.log(response);

    changeNewStafferPassword(req.body, response.token)
        .then(success => {
            response.processed = true;
            if (success) {
                response.passwordChanged = true;
            } else {
                response.passwordChanged = false;
            }

            res.render('addNewApplicant', { layout: 'main', response });
            return;
        })
        .catch(err => next(err));
}

function changeApplicantPassword(req, res, next) {
    var response = { ...req.body, error: "", passwordChanged: false, processed: false };
    if (req.body.password.length < 5) {
        response.error = "Password must be at list 6 characters";
        res.render('addNewApplicant', { layout: 'main', response });
        return;
    } else if (req.body.password != req.body.comfirm_password) {
        response.error = "Passwords does not much";
        res.render('addNewApplicant', { layout: 'main', response });
        return;
    }

    // console.log(response);

    changeNewStafferPassword(req.body, response.token)
        .then(success => {
            response.processed = true;
            if (success) {
                response.passwordChanged = true;
            } else {
                response.passwordChanged = false;
            }

            res.render('addNewApplicant', { layout: 'main', response });
            return;
        })
        .catch(err => next(err));
}

function getEmployers(req, res, next) {
    getAllEmployers(req.query.page || 1, req.query.pageSize || 8)
        .then(employers => employers ? res.status(200).send({ success: true, employers }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getCompanyDetails(req, res, next) {
    getCompanyDetailsInfo(req.params.companyProfileId)
        .then(employers => employers ? res.status(200).send({ success: true, employers }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function verifyEmployer(req, res, next) {
    verifyEmployerLicense(req.params.id)
        .then(success => res.status(200).send({ success }))
        .catch(err => next(err));
}

function getAllIssues(req, res, next) {
    getAllReportedIssues()
        .then(issues => issues ? res.status(200).send({ success: true, issues }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getApplicantIssuesAdmin(req, res, next) {
    getAllIssuesFromApplicants()
        .then(issues => issues ? res.status(200).send({ success: true, issues }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getCompanyIssuesAdmin(req, res, next) {
    getAllIssuesFromCompany()
        .then(issues => issues ? res.status(200).send({ success: true, issues }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function addIssueResponse(req, res, next) {
    postIssueResponse(req.body, req.user.sub)
        .then(issueResponse => issueResponse ? res.status(200).send({ success: true, issueResponse }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function getStaffsCompany(req, res, next) {
    adminGetCompanyStaffs(req.params.companyProfileId)
        .then(staffs => staffs ? res.status(200).send({ success: true, staffs }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

function addStaffsCompany(req, res, next) {
    adminAddCompanyStaffs(req.body, req.params.companyProfileId)
        .then(staffs => staffs ? res.status(200).send({ success: true, staffs }) : res.status(200).send({ success: false, error: "Something went wrong!" }))
        .catch(err => next(err));
}

async function getIndutries() {
    const industries = await otherService.getAllIndustries();
    if (industries) {
        return industries;
    }
}

async function addEmployerIssue(issue, userId) {
    const user = await userService.getUserById(userId);
    if (user) {
        const newIssue = await otherService.addIssue({ ...issue, CompanyProfileId: user.companyProfileId });
        if (newIssue) {
            return newIssue;
        }
    }
}

async function getEmployerIssues(userId) {
    const user = await userService.getUserById(userId);
    if (user) {
        const issues = await otherService.getEmployerIssues(user.companyProfileId);
        if (issues) {
            return issues;
        }
    }
}

async function addApplicantIssue(issue, userId) {
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if (applicant) {
        const newIssue = await otherService.addIssue({ ...issue, ApplicantProfileId: applicant.id });
        if (newIssue) {
            return newIssue;
        }
    }
}

async function getApplicantIssues(userId) {
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if (applicant) {
        const issues = await otherService.getApplicantIssues(applicant.id);
        if (issues) {
            return issues;
        }
    }
}

async function getEmployerStaffs(userId) {
    const user = await userService.getUserById(userId);
    if (user && user.company_profile) {
        const staffs = await otherService.getCompanyStaffs(user.companyProfileId);
        if (staffs) {
            return staffs;
        }
    }
}

async function adminGetCompanyStaffs(companyProfileId) {
    if (companyProfileId) {
        const staffs = await otherService.getCompanyStaffs(companyProfileId);
        if (staffs) {
            return staffs;
        }
    }
}

async function adminAddCompanyStaffs(body, compProfileId) {
    //console.log(body)
    //console.log(compProfileId)
    if (compProfileId && body.email) {
        const userExists = await userService.getUserByEmail(body.email);
        const tokenExists = await otherService.getTokenEmail(body.email);
        if (userExists || tokenExists) {
            return false;
        }

        const token = uuidv4();
        const saveToken = await otherService.saveToken(token, body.email);
        const newUser = await userService.createUser({ ...body, role: ROLE.STAFFER, companyProfileId: compProfileId, password: uuidv4(), username: body.email, hasFinishedProfile: true });
        if (saveToken && newUser) {
            const message = constractStafferEmail(body.email, token);
            sgMail.send(message);
            return true;
        }
    }
    return false;
}

async function getCompanyDetailsInfo(companyProfileId) {
    const user = await userService.getAllByCompanyProfileId(companyProfileId);
    const company = await userService.getCompanyProfileById(companyProfileId);
    if (company) {
        return { company, user }
    }
}

async function getApplicantIssue(userId, issueId) {
    const applicant = await userService.getApplicantProfileByUserId(userId);
    if (applicant) {
        const issue = await otherService.getApplicantIssueById(applicant.id, issueId);
        if (issue) {
            return issue;
        }
    }
}

async function addCompanyStaffer(body, userId) {
    const user = await userService.getUserById(userId);
    if (user && user.companyProfileId, body.email) {
        const userExists = await userService.getUserByEmail(body.email);
        const tokenExists = await otherService.getTokenEmail(body.email);
        if (userExists || tokenExists) {
            return false;
        }
        const token = uuidv4();
        const saveToken = await otherService.saveToken(token, body.email);
        const newUser = await userService.createUser({ ...body, role: ROLE.STAFFER, companyProfileId: user.companyProfileId, password: uuidv4(), username: body.email, hasFinishedProfile: true });
        if (saveToken && newUser) {
            const message = constractStafferEmail(body.email, token);
            sgMail.send(message);
            return true;
        }
    }
    return false;
}

async function renderNewStafferPassword(req) {
    if (req.params.token && req.params.token) {
        const exists = await otherService.getToken(req.params.token)
        if (exists) {
            return { ...req.params, verified: true, passwordChanged: false, processed: false }
        }
    }
    return { ...req.params, verified: false, passwordChanged: false, processed: false }
}

async function renderNewApplicantPassword(req) {
    if (req.params.token && req.params.token) {
        const exists = await otherService.getToken(req.params.token)
        if (exists) {
            return { ...req.params, verified: true, passwordChanged: false, processed: false }
        }
    }
    return { ...req.params, verified: false, passwordChanged: false, processed: false }
}

async function changeNewStafferPassword(body, token) {
    // console.log(token);
    const user = await userService.getUserByEmail(body.email);
    if (user) {
        // const updatedUser = await userService.updateUserField(bcryptjs.hashSync(body.password, 10), 'password', user.id);
        const updatedUser = await userService.updateUserById(user.id, { password: bcryptjs.hashSync(body.password, 10), emailVerified: true });
        const updateToken = await otherService.updateToken(token, { expired: true });
        if (updatedUser && updateToken) {
            return true;
        }
    }

    return false;
}

async function getAllEmployers(page, pageSize) {
    const pager = {
        pageSize: parseInt(pageSize),
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    //console.log(offset)
    //console.log(pager)
    //const company_profile = await userService.getAllCompanyProfile();
    const employers = await userService.getCompanyWithOffsetAndLimit(offset, limit);
    if (employers) {
        pager.totalItems = employers.count;
        pager.totalPages = Math.ceil(employers.count / pager.pageSize);
        return {
            pager,
            rows: employers.rows
        }

    }
}

async function verifyEmployerLicense(id) {
    const companyProfile = await userService.getCompanyProfileById(id);
    if (companyProfile) {
        if (companyProfile.verified) {
            const verified = await userService.updateCompanyField(false, 'verified', id);
            if (verified[0] > 0) {
                return true;
            }
        } else {
            const verified = await userService.updateCompanyField(true, 'verified', id);
            if (verified[0] > 0) {
                return true;
            }
        }
    }

    return false;
}

async function getAllReportedIssues() {
    const issues = await otherService.getAllReportedIssues();

    if (issues) {
        return issues;
    }
}

async function getAllIssuesFromApplicants() {
    const issues = await otherService.getAllReportedApplicantIssues();
    if (issues) {
        return issues;
    }
}

async function getAllIssuesFromCompany() {
    const issues = await otherService.getAllReportedCompanyIssues();

    if (issues) {
        return issues;
    }
}

async function postIssueResponse(issueResponse, userId) {

    if (issueResponse.issueResponse && issueResponse.issueId) {
        const existingIssue = await otherService.getIssueById(issueResponse.issueId);
        if (existingIssue) {
            const savedIssueResponse = await otherService.addIssueResponse({ ...issueResponse, userId });
            if (savedIssueResponse) {
                const updatedIssue = await otherService.updateIssueField(savedIssueResponse.id, "IssueResponseId", existingIssue.id);
                // console.log(updatedIssue);
                if (updatedIssue[0] > 0) {
                    return savedIssueResponse;
                }
            }
        }
    }
}

async function getSearchedIndustry(search) {
    if (search) {
        const industries = await otherService.getIndutriesSearch(search);
        if (industries) {
            return industries;
        }
    } else return {}

}

async function getAdvancedSearched(search, employType, industry, salaryRange, cityName, page) {
    const pager = {
        pageSize: 8,
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
    }
    if (cityName == "undefined") {
        cityName = '';
    }
    console.log(search, employType, industry, cityName, page)
    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;
    //console.log(offset)
    queryResult = advancedSearchQueryBuilder(search, employType, industry, salaryRange, cityName, offset, limit);
    console.log(queryResult.selectQuery)
    console.log(queryResult.count);
    //let QueryCount = `SELECT COUNT(*) FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%' or industry like '${search}%')`;
    // let query=`SELECT * FROM view_companies_jobs_search WHERE cityName like '${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%' or industry like '${search}%') order by createdAt DESC  LIMIT ${offset},${limit}`

    // if(employType !='' && industry != ''){
    //     //console.log('sdljf')
    //     query=`SELECT * FROM view_companies_jobs_search WHERE industry='${industry}' and employmentType='${employType}' and (cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%')) order by createdAt DESC  LIMIT ${offset},${limit}`
    //     QueryCount=`SELECT COUNT(*) FROM view_companies_jobs_search WHERE industry='${industry}' and employmentType='${employType}' and (cityName like '%${cityName}%' and (jobTitle like '%${search}%' or companyName like '${search}%')) order by createdAt DESC  LIMIT ${offset},${limit}`
    // }
    // else if(employType !='' && industry ==''){
    //     //console.log('no ind')
    //     query=`SELECT * FROM view_companies_jobs_search WHERE employmentType='${employType}' and (cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%')) order by createdAt DESC  LIMIT ${offset},${limit}` 
    //     QueryCount=`SELECT * FROM view_companies_jobs_search WHERE employmentType='${employType}' and (cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%')) order by createdAt DESC  LIMIT ${offset},${limit}` 

    // }else if(employType =='' & industry != ''){
    //     //console.log('no emp')
    //     query=`SELECT * FROM view_companies_jobs_search WHERE industry='${industry}' and (cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%')) order by createdAt DESC  LIMIT ${offset},${limit}` 
    //     QueryCount=`SELECT COUNT(*) FROM view_companies_jobs_search where industry='${industry}' and (cityName like '%${cityName}%' or jobTitle like '%${search}%' or companyName like '${search}%') order by createdAt DESC  LIMIT ${offset},${limit}` 

    // }
    // else{
    //     QueryCount=`SELECT COUNT(*)  FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%') order by createdAt`

    //     query=`SELECT * FROM view_companies_jobs_search WHERE cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%') order by createdAt DESC  LIMIT ${offset},${limit}`
    // }

    const jobs = await jobsService.executeSearchQuery(queryResult.selectQuery);
    console.log(jobs)
    if (jobs) {
        console.log('here in')
        counts = await jobsService.executeSearchQuery(queryResult.count);
        console.log(counts)
        if(counts){
            pager.totalItems = Object.values(counts[0])[0];
            console.log(counts)
            pager.totalPages = Math.ceil(pager.totalItems / pager.pageSize);
        }
        return {
            pager,
            rows: jobs
        };
    }
 
}


function advancedSearchQueryBuilder(search, employType, industry, salaryRange, cityName, offset, limit) {
    let query = ``;
    let haveWhere = false;
    if (employType != "") {
        query = query + ` where employmentType='${employType}'`;
        haveWhere = true;
    } if (industry != "") {
        if (haveWhere) {
            query = query + ` and industry='${industry}'`;
        }else{
            query = query + ` where industry='${industry}'`;
            haveWhere = true;
        }
    }
    if (salaryRange != "") {
        if (haveWhere) {
            query = query + ` and salaryRange=${salaryRange}`;
        } else {
            query = query + ` where salaryRange=${salaryRange}`;
            haveWhere = true;
        }
    }
    if (haveWhere) {
        query = query + ` and (cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%'))`;
    } else {
        query = query + ` where cityName like '%${cityName}%' or (jobTitle like '%${search}%' or companyName like '${search}%')`;
    }
    let selectQuery=`select * from view_companies_jobs_search `+query;
    let QueryCount=`SELECT COUNT(*) FROM view_companies_jobs_search`+query;
    return {selectQuery:selectQuery,count:QueryCount};
}

module.exports = {
    getAllIndustries,
    addEmpIssue,
    getEmpIssues,
    addIssue,
    getIssues,
    getIssue,
    addStaff,
    addNewStaffer,
    addNewApplicant,
    changeStafferPassword,
    changeApplicantPassword,
    getStaffs,
    getEmployers,
    getCompanyDetails,
    verifyEmployer,
    getAllIssues,
    getApplicantIssuesAdmin,
    getCompanyIssuesAdmin,
    addIssueResponse,
    getStaffsCompany,
    addStaffsCompany,
    searchIndustry,
    advancedSearchJob
}