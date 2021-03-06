const otherService = require('../services/other.service');
const userService = require('../services/user.service');
const jobsService = require('../services/job.service');
const authService = require('../services/auth.service');
const JobsController = require('../controllers/jobs.controller');
const ROLE = require('../_helpers/role');
const jwt = require('jsonwebtoken');
const sequelize = require("../database/connection");

var fs = require('fs');
var path = require('path');
const { validateIssue, validateAds } = require('../_helpers/validators');
const constractStafferEmail = require('../_helpers/construct_staffer_email');
const constractAdminStaffEmail = require('../_helpers/construct_adminStaff_email');
const uuidv4 = require('uuid/v4');
const sgMail = require('@sendgrid/mail');
const CONSTANTS = require('../../constants');
const bcryptjs = require('bcryptjs');
var moment = require('moment');
var _ = require('lodash');
var formidable = require('formidable');
sgMail.setApiKey(CONSTANTS.SENDGRID_KEY);

function getAdminDashboardCounts(req, res, next) {
  getAdminStats(req.user.sub)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getApplicantReport(req, res, next) {
  getApplicantStatsReport(req.user.sub, req.query.page || 1, req.query.pageSize || 7, req.query.order)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next(err));
}

function getApplicantReportFilter(req, res, next) {
  getApplicantStatsFilterReport(req.query.startDate, req.query.endDate, req.query.page || 1, req.query.pageSize || 7, req.query.order)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next(err));
}

function getEmployerReport(req, res, next) {
  getEmployerStatsReport(req.user.sub, req.query.page || 1, req.query.pageSize || 7, req.query.order)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next(err));
}

function getEmployerReportFilter(req, res, next) {
  getEmployerStatsFilterReport(req.query.startDate, req.query.endDate, req.query.page || 1, req.query.pageSize || 5, req.query.order)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next(err));
}

function getEmployerJobReportFilter(req, res, next) {
  getEmployerJobsStatsFilterReport(req.params.companyId, req.query.startDate, req.query.endDate, req.query.page || 1, req.query.pageSize || 5, req.query.order)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next(err));
}


function getAdminIssueStats(req, res, next) {
  getIssueStats(req.user.sub)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getApplicantDashboardCounts(req, res, next) {
  getApplicantStats(req.user.sub)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getEmployerDashboardCounts(req, res, next) {
  getEmployerStats(req.user.sub)
    .then(stats => res.status(200).send({ success: true, stats }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getAllIndustries(req, res, next) {
  getIndutries()
    .then(industries => res.status(200).send({ success: true, industries }))
    .catch(err => next("Internal Server Error! Try again"));
}

function searchIndustry(req, res, next) {
  getSearchedIndustry(req.query.search)
    .then(industries =>
      industries
        ? res.status(200).json({ success: true, industries })
        : res
          .status(200)
          .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function advancedSearchJob(req, res, next) {
  var header = req.headers["authorization"] || "",
    token = header.split(/\s+/).pop() || "";
  let userId = null;
  let role = null;
  if (token) {
    try {
      var decoded = jwt.verify(token, CONSTANTS.JWTSECRET);
      userId = decoded.sub;
      role = decoded.role;
    } catch {
      // throw "invalid token";
    }
  }
  getAdvancedSearched(
    req.query.search || "",
    req.query.et || "",
    req.query.industry || "",
    req.query.sr || "",
    req.query.ct || "",
    req.query.pwd || 1,
    req.query.page || 1,
    userId,
    role
  )
    .then(jobs =>
      jobs
        ? res.status(200).json({ success: true, jobs })
        : res
          .status(200)
          .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}
function searchCountLocations(req, res, next) {
  getSearchCountLocations()
    .then(cityCount =>
      cityCount
        ? res.status(200).json({ success: true, cityCount })
        : res
          .status(200)
          .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function deactivateAds(req, res, next) {
  console.log(req.body);
  deactivateAdsById(req.params.id)
    .then(ads =>
      ads
        ? res.status(200).json({ success: true, ads })
        : res
          .status(200)
          .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function editAdvertisement(req, res, next) {
  editAdvertisementById(req.params.id, req.body)
    .then(advs =>
      advs
        ? res.status(200).json({ success: true, advs })
        : res
          .status(200)
          .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getAdsById(req, res, next) {
  getAdsOneById(req.params.id)
    .then(advs =>
      advs
        ? res.status(200).json({ success: true, advs })
        : res
          .status(200)
          .json({ success: false, error: "Something went wrong" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addEmpIssue(req, res, next) {
  let localImagePath = "";
  let issue = {};
  let fileName = "";
  let userId = req.user.sub;
  var form = new formidable.IncomingForm();

  // console.log("file extenstion")
  form.on("fileBegin", (name, file) => {
    // console.log(file.size, "file extenstion")
    let fileExt = file.name.substr(file.name.lastIndexOf(".") + 1);
    fileName = moment().format("YYYYMMDDHHmmssSS");
    file.path = CONSTANTS.baseDir + "/uploads/" + fileName + "." + fileExt;
    localImagePath = file.path;
  });
  form.on("file", function (name, file) {
    // console.log('Uploaded ' + file.name);
  });
  form.parse(req, function (err, fields, files) {
    _.map(fields, (value, key) => {
      issue[key] = value;
    });

    const valid = validateIssue(issue);
    if (valid != true) {
      res.status(200).json({ success: false, validationError: valid });
      return;
    }
    if (localImagePath != "") {
      processFileUpload(userId, issue, fileName, localImagePath, "employer")
        .then(issue => {
          fs.unlinkSync(localImagePath);
          res.status(200).send({ success: true, issue });
        })
        .catch(err => next("Internal Server Error! Try again"));
    } else {
      processFileUpload(userId, issue, fileName, localImagePath, "employer")
        .then(issue => {
          res.status(200).send({ success: true, issue });
        })
        .catch(err => next("Internal Server Error! Try again"));
    }
  });
}

function getEmpIssues(req, res, next) {
  getEmployerIssues(req.user.sub)
    .then(issues =>
      issues
        ? res.status(200).send({ success: true, issues })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addReports(req, res, next) {
  addApplicantReports(req.body, req.user.sub, req.params.id)
    .then(reports =>
      reports
        ? res.status(200).send({ success: true, reports })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}
function adminAddAds(req, res, next) {
  let localImagePath = "";
  let ads = {};
  let fileName = "";
  let userId = req.user.sub;
  var form = new formidable.IncomingForm();
  form.on("fileBegin", (name, file) => {
    let fileExt = file.name.substr(file.name.lastIndexOf(".") + 1);
    if (name == "image") {
      fileName = moment().format("YYYYMMDDHHmmssSS");
      file.path = CONSTANTS.baseDir + "/uploads/" + fileName + "." + fileExt;
      localImagePath = file.path;
    }
  });
  form.on("file", function (name, file) {
    // console.log('Uploaded ' + file.name);
  });

  form.parse(req, function (err, fields, files) {
    _.map(fields, (value, key) => {
      ads[key] = value;
      // console.log(key, '=', value)
    });

    const valid = validateAds(ads);
    if (valid != true) {
      res.status(200).json({ success: false, validationError: valid });
      return;
    }

    ads = { ...ads, active: 1 };
    // console.log(ads)
    if (localImagePath != "") {
      // console.log('a')
      processAdsUpload(userId, ads, fileName, localImagePath)
        .then(ads => {
          fs.unlinkSync(localImagePath);
          res.status(200).send({ success: true, ads });
        })
        .catch(err => {
          console.log(err);
          next("Internal Server Error! Try again");
        });
    }
  });
}

function addIssue(req, res, next) {
  let localImagePath = "";
  let issue = {};
  let fileName = "";
  let userId = req.user.sub;
  var form = new formidable.IncomingForm();
  form.on("fileBegin", (name, file) => {
    let fileExt = file.name.substr(file.name.lastIndexOf(".") + 1);
    if (name == "picture") {
      fileName = moment().format("YYYYMMDDHHmmssSS");
      file.path = CONSTANTS.baseDir + "/uploads/" + fileName + "." + fileExt;
      localImagePath = file.path;
    }
  });
  form.on("file", function (name, file) {
    // console.log('Uploaded ' + file.name);
  });

  form.parse(req, function (err, fields, files) {
    _.map(fields, (value, key) => {
      issue[key] = value;
    });

    const valid = validateIssue(issue);
    if (valid != true) {
      res.status(200).json({ success: false, validationError: valid });
      return;
    }
    if (localImagePath != "") {
      processFileUpload(userId, issue, fileName, localImagePath, "applicant")
        .then(issue => {
          fs.unlinkSync(localImagePath);
          res.status(200).send({ success: true, issue });
        })
        .catch(err => next("Internal Server Error! Try again"));
    } else {
      processFileUpload(userId, issue, fileName, localImagePath, "applicant")
        .then(issue => {
          res.status(200).send({ success: true, issue });
        })
        .catch(err => next("Internal Server Error! Try again"));
    }
  });
}

function getAdminStaff(req, res, next) {
  getAdminStaffers(req.user.sub, req.query.pageSize || 8, req.query.page || 1)
    .then(staffs =>
      staffs
        ? res.status(200).send({ success: true, staffs })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addAdminStaff(req, res, next) {
  addAdminStaffer(req.body, req.user.sub)
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getIssues(req, res, next) {
  getApplicantIssues(req.user.sub)
    .then(issues =>
      issues
        ? res.status(200).send({ success: true, issues })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getStaffs(req, res, next) {
  getEmployerStaffs(req.user.sub)
    .then(staffs =>
      staffs
        ? res.status(200).send({ success: true, staffs })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getIssue(req, res, next) {
  getApplicantIssue(req.user.sub, req.params.id)
    .then(issue =>
      issue
        ? res.status(200).send({ success: true, issue })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getEmpIssueById(req, res, next) {
  getEmployerIssue(req.user.sub, req.params.id)
    .then(issue =>
      issue
        ? res.status(200).send({ success: true, issue })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function deleteEmpIssue(req, res, next) {
  deleteEmployerIssue(req.user.sub, req.params.id)
    .then(issue =>
      issue
        ? res.status(200).send({ success: true, issue })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function deleteAppIssue(req, res, next) {
  deleteApplicantIssue(req.user.sub, req.params.id)
    .then(issue =>
      issue
        ? res.status(200).send({ success: true, issue })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addStaff(req, res, next) {
  addCompanyStaffer(req.body, req.user.sub)
    .then(staff =>
      staff
        ? res.status(200).send({ success: true, staff })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addNewStaffer(req, res, next) {
  renderNewStafferPassword(req)
    .then(response => res.render("addNewStaffer", { layout: "main", response }))
    .catch(err => next("Internal Server Error! Try again"));
}

function addNewApplicant(req, res, next) {
  renderNewApplicantPassword(req)
    .then(response =>
      res.render("addNewApplicant", { layout: "main", response })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function changeStafferPassword(req, res, next) {
  var response = {
    ...req.body,
    error: "",
    passwordChanged: false,
    processed: false
  };
  if (req.body.password.length < 5) {
    response.error = "Password must be at list 6 characters";
    res.render("addNewApplicant", { layout: "main", response });
    return;
  } else if (req.body.password != req.body.comfirm_password) {
    response.error = "Passwords does not much";
    res.render("addNewApplicant", { layout: "main", response });
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

      res.render("addNewApplicant", { layout: "main", response });
      return;
    })
    .catch(err => next("Internal Server Error! Try again"));
}

function changeApplicantPassword(req, res, next) {
  var response = {
    ...req.body,
    error: "",
    passwordChanged: false,
    processed: false
  };
  if (req.body.password.length < 5) {
    response.error = "Password must be at list 6 characters";
    res.render("addNewApplicant", { layout: "main", response });
    return;
  } else if (req.body.password != req.body.comfirm_password) {
    response.error = "Passwords does not much";
    res.render("addNewApplicant", { layout: "main", response });
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

      res.render("addNewApplicant", { layout: "main", response });
      return;
    })
    .catch(err => next("Internal Server Error! Try again"));
}

function getEmployers(req, res, next) {
  getAllEmployers(req.query.page || 1, req.query.pageSize || 8)
    .then(employers =>
      employers
        ? res.status(200).send({ success: true, employers })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function adminGetAllAds(req, res, next) {
  getAllAds(req.query.page || 1, req.query.pageSize || 8)
    .then(ads =>
      ads
        ? res.status(200).send({ success: true, ads })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getAdvertisement(req, res, next) {
  getAdvertisementOfToday()
    .then(ads =>
      ads
        ? res.status(200).send({ success: true, ads })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getVerticalAdvertisement(req, res, next) {
  getVertialAdvertisementOfToday()
    .then(ads =>
      ads
        ? res.status(200).send({ success: true, ads })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getCompanyDetails(req, res, next) {
  getCompanyDetailsInfo(req.params.companyProfileId)
    .then(employers =>
      employers
        ? res.status(200).send({ success: true, employers })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function verifyEmployer(req, res, next) {
  verifyEmployerLicense(req.params.id)
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

function checkReport(req, res, next) {
  updateCheckReportById(req.params.id)
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getAllIssues(req, res, next) {
  getAllReportedIssues()
    .then(issues =>
      issues
        ? res.status(200).send({ success: true, issues })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getReportById(req, res, next) {
  reportById(req.params.id)
    .then(report =>
      report
        ? res.status(200).send({ success: true, report })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}
function getIssueById(req, res, next) {
  getReportedIssueById(req.params.id)
    .then(issue =>
      issue
        ? res.status(200).send({ success: true, issue })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getApplicantReports(req, res, next) {
  getAllreportsFromApplicants()
    .then(reports =>
      reports
        ? res.status(200).send({ success: true, reports })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}
function getApplicantIssuesAdmin(req, res, next) {
  getAllIssuesFromApplicants()
    .then(issues =>
      issues
        ? res.status(200).send({ success: true, issues })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getCompanyIssuesAdmin(req, res, next) {
  getAllIssuesFromCompany()
    .then(issues =>
      issues
        ? res.status(200).send({ success: true, issues })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addIssueResponse(req, res, next) {
  postIssueResponse(req.body, req.user.sub)
    .then(issueResponse =>
      issueResponse
        ? res.status(200).send({ success: true, issueResponse })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getStaffsCompany(req, res, next) {
  adminGetCompanyStaffs(req.params.companyProfileId)
    .then(staffs =>
      staffs
        ? res.status(200).send({ success: true, staffs })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function addStaffsCompany(req, res, next) {
  adminAddCompanyStaffs(req.body, req.params.companyProfileId)
    .then(staffs =>
      staffs
        ? res.status(200).send({ success: true, staffs })
        : res
          .status(200)
          .send({ success: false, error: "Something went wrong!" })
    )
    .catch(err => next("Internal Server Error! Try again"));
}

function getFeaturedCompanies(req, res, next) {
  getFeaturedCompaniesHandler()
    .then(companies => res.status(200).send({ success: true, companies }))
    .catch(err => next("Internal Server Error! Try again"));
}

function getExemptCompanies(req, res, next) {
  getExemptCompaniesHandler(req.query.page || 1, req.query.pageSize || 8)
    .then(companies => res.status(200).send({ success: true, companies }))
    .catch(err => next("Internal Server Error! Try again"));
}

function addRemoveFeaturedCompany(req, res, next) {
  let id = req.params.id;
  if (!id) {
    res.status(200).send({ success: false, error: "invlaid request" });
  }

  addRemoveFeaturedCompanyHandler(id)
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

function addRemoveExemptCompany(req, res, next) {
  let id = req.params.id;
  if (!id) {
    res.status(200).send({ success: false, error: "invlaid request" });
  }
  addRemoveExemptCompanyHandler(id)
    .then(success => res.status(200).send({ success }))
    .catch(err => next("Internal Server Error! Try again"));
}

async function processFileUpload(
  userId,
  issue,
  fileName,
  localImagepath,
  role
) {
  if (localImagepath != "") {
    const imgObj = await uploadFile(
      localImagepath,
      "th-employer-logo",
      fileName
    );
    // issue.bucket = 'th-employer-logo';
    issue.picture = imgObj.Location;
  }

  if (role === "employer") {
    return addEmployerIssue(issue, userId);
  } else if (role === "applicant") {
    return addApplicantIssue(issue, userId);
  }
}

async function processAdsUpload(userId, ads, fileName, localImagePath) {
  if (localImagePath != "") {
    const imgObj = await uploadFile(
      localImagePath,
      "th-employer-logo",
      fileName
    );
    // issue.bucket = 'th-employer-logo';
    ads.image = imgObj.Location;
  }
  // console.log(ads.image, 'image')
  return addAds(ads, userId);
}

function uploadFile(file, bucketName, fileName) {
  return uploadFilePromise(file, bucketName, fileName).then(data => {
    return data;
  });
}

function uploadFilePromise(file, bucketName, fileName) {
  var uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: "",
    ACL: "public-read"
  };
  var fileStream = fs.createReadStream(file);
  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(file);
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      // console.log(data);
      if (err) {
        reject("Internal Server Error! Try again");
      }
      if (data) {
        resolve(data);
      } else {
        reject("system error");
      }
    });
  });
}

async function getAdminStats(userId) {
  const user = await userService.getUserById(userId);
  if (user && (user.role === ROLE.ADMIN || user.role === ROLE.ADMINSTAFF)) {
    const stats = await otherService.getAdminStats();
    if (stats) {
      return stats;
    }
  }
}

async function getApplicantStatsReport(userId, page, pageSize, order) {

  const user = await userService.getUserById(userId);
  if (user && (user.role === ROLE.ADMIN || user.role === ROLE.ADMINSTAFF)) {
      const pager = {
          pageSize: parseInt(pageSize),
          totalItems: 0,
          totalPages: 0,
          currentPage: parseInt(page)
      }
      // console.log(pager)
      const offset = (page - 1) * pager.pageSize;
      const limit = pager.pageSize;

      const reports = await otherService.getApplicantMarketingReports(offset, limit);

      if (reports) {
          pager.totalItems = reports.count;
          pager.totalPages = Math.ceil(reports.count / pager.pageSize);
          if(order === 'ASC') {
            reports.rows = reports.rows.reverse()
          }
          return {
              pager,
              rows: reports.rows
          }
      }
  }
}

async function getEmployerStatsReport(userId, page, pageSize, order) {

  const user = await userService.getUserById(userId);
  if (user && (user.role === ROLE.ADMIN || user.role === ROLE.ADMINSTAFF)) {
    const pager = {
      pageSize: parseInt(pageSize),
      totalItems: 0,
      totalPages: 0,
      currentPage: parseInt(page)
    }

    const offset = (page - 1) * pager.pageSize;
    const limit = pager.pageSize;

    const reports = await otherService.getEmployerMarketingReports(offset, limit, order);

    if (reports) {
      pager.totalItems = reports.count;
      pager.totalPages = Math.ceil(reports.count / pager.pageSize);
      return {
        pager,
        rows: reports.rows
      }
    }
  }
}

async function getEmployerJobsStatsFilterReport(startDate, endDate, page, pageSize, order) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  }
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const reports = await otherService.getEmployerJobsFilteredMarketingReports(companyId,startDate, endDate, offset, limit, order);

  if (reports) {
    pager.totalItems = reports.count;
    pager.totalPages = Math.ceil(reports.count / pager.pageSize);
    return {
      pager,
      rows: reports.rows,
    }
  }
}

async function getEmployerStatsFilterReport(startDate, endDate, page, pageSize, order) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  }
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const reports = await otherService.getEmployerFilteredMarketingReports(startDate, endDate, offset, limit, order);

  if (reports) {
    pager.totalItems = reports.count;
    pager.totalPages = Math.ceil(reports.count / pager.pageSize);
    return {
      pager,
      rows: reports.rows,
    }
  }
}

async function getApplicantStatsFilterReport(startDate, endDate, page, pageSize, order) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  }
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const reports = await otherService.getApplicantFilteredMarketingReports(startDate, endDate, offset, limit, order);

  if (reports) {
    pager.totalItems = reports.count;
    pager.totalPages = Math.ceil(reports.count / pager.pageSize);
    console.log(pager, "ehlsjdfios")
    return {
      pager,
      rows: reports.rows,
    }
  }
}

async function getIssueStats(userId) {
  const user = await userService.getUserById(userId);
  if (user && (user.role === ROLE.ADMIN || user.role === ROLE.ADMINSTAFF)) {
    const stats = await otherService.getIssueStats();
    if (stats) {
      return stats;
    }
  }
}

async function getEmployerStats(userId) {
  const user = await userService.getUserById(userId);

  if (user) {
    const stats = await otherService.getEmployerStats(user.companyProfileId);
    if (stats) {
      return stats;
    }
  }
}

async function getApplicantStats(userId) {
  const user = await userService.getApplicantProfileByUserId(userId);
  if (user) {
    const stats = await otherService.getApplicantStats(user.id);
    if (stats) {
      return stats;
    }
  }
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
    const newIssue = await otherService.addIssue({
      ...issue,
      CompanyProfileId: user.companyProfileId
    });
    if (newIssue) {
      return newIssue;
    }
  }
}

async function addApplicantReports(reports, userId, jobId) {
  const applicant = await userService.getApplicantProfileByUserId(userId);
  if (applicant) {
    const newReports = await otherService.addReports({
      ...reports,
      ApplicantProfileId: applicant.id,
      JobId: jobId
    });
    if (newReports) {
      return newReports;
    }
  }
}

async function addAds(body, userId) {
  // console.log({ ...body, userId }, 'body')
  const ads = await otherService.addAdvertisement({ ...body, userId });
  if (ads) {
    return ads;
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
    const newIssue = await otherService.addIssue({
      ...issue,
      ApplicantProfileId: applicant.id
    });
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
  // console.log(body)
  // console.log(compProfileId)
  if (compProfileId && body.email) {
    // console.log(body.email, "email");
    const userExists = await userService.getUserByEmail(body.email);
    const tokenExists = await otherService.getTokenEmail(body.email);

    // console.log(userExists, "user");
    // console.log(tokenExists, 'token')
    if (userExists || tokenExists) {
      return false;
    }
    // console.log('to be created')
    const token = uuidv4();
    const saveToken = await otherService.saveToken(token, body.email);
    const userApi = await authService.createUserApi({
      ...body,
      password: uuidv4(),
      username: body.email,
      role: ROLE.STAFFER
    });
    const newUser = await userService.createUser({
      ...body,
      companyProfileId: compProfileId,
      username: body.email,
      hasFinishedProfile: true,
      role: ROLE.STAFFER
    });
    // console.log('created')
    if (saveToken && newUser && userApi) {
      const message = constractStafferEmail(body.firstName, body.email, token);
      sgMail.send(message);
      // console.log('sent')
      return true;
    }
  }
  return false;
}

async function getCompanyDetailsInfo(companyProfileId) {
  const user = await userService.getAllByCompanyProfileId(companyProfileId);
  const company = await userService.getCompanyProfileById(companyProfileId);
  if (company) {
    return { company, user };
  }
}

async function getEmployerIssue(userId, issueId) {
  const user = await userService.getUserById(userId);
  if (user) {
    const issue = await otherService.getEmployerIssueById(
      user.companyProfileId,
      issueId
    );
    if (issue) {
      return issue;
    }
  }
}

async function deleteEmployerIssue(userId, issueId) {
  const user = await userService.getUserById(userId);
  if (user) {
    const issue = await otherService.deleteEmployerIssue(
      user.companyProfileId,
      issueId
    );
    if (issue) {
      return issue;
    }
  }
}

async function deleteApplicantIssue(userId, issueId) {
  const applicant = await userService.getApplicantProfileByUserId(userId);
  if (applicant) {
    const issue = await otherService.deleteApplicantIssue(
      applicant.id,
      issueId
    );
    if (issue) {
      return issue;
    }
  }
}

async function getApplicantIssue(userId, issueId) {
  const applicant = await userService.getApplicantProfileByUserId(userId);
  if (applicant) {
    const issue = await otherService.getApplicantIssueById(
      applicant.id,
      issueId
    );
    if (issue) {
      return issue;
    }
  }
}

async function getAdminStaffers(userId, pageSize, page) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const user = await userService.getUserById(userId);
  if (user && user.role === "ADMIN") {
    const staffs = await otherService.getAdminStaffs(offset, limit);
    if (staffs) {
      pager.totalItems = staffs.count;
      pager.totalPages = Math.ceil(staffs.count / pager.pageSize);
      return {
        pager,
        rows: staffs.rows
      };
    }
  }
}

async function addAdminStaffer(body, userId) {
  const user = await userService.getUserById(userId);
  if (user && body.email) {
    const userExists = await userService.getUserByEmail(body.email);
    const tokenExists = await otherService.getTokenEmail(body.email);
    if (userExists || tokenExists) {
      return false;
    }
    const token = uuidv4();
    const saveToken = await otherService.saveToken(token, body.email);
    const user = await authService.createUserApi({
      ...body,
      password: uuidv4(),
      username: body.email,
      emailVerificationToken: uuidv4()
    });
    if (user.data.success) {
      const newUser = await userService.createUser({
        ...body,
        id: user.data.user.id,

        username: body.email
      });
      if (saveToken && newUser && user.data.success) {
        const message = constractAdminStaffEmail(
          body.firstName,
          body.email,
          token
        );
        sgMail.send(message);
        return true;
      }
    }
  }
  return false;
}

async function addCompanyStaffer(body, userId) {
  const user = await userService.getUserById(userId);
  if ((user && user.companyProfileId, body.email)) {
    const userExists = await userService.getUserByEmail(body.email);
    const tokenExists = await otherService.getTokenEmail(body.email);
    if (userExists || tokenExists) {
      return false;
    }

    const token = uuidv4();
    const saveToken = await otherService.saveToken(token, body.email);
    const userApi = await authService.createUserApi({
      ...body,
      password: uuidv4(),
      username: body.email,
      role: ROLE.STAFFER
    });
    if (userApi.data.success) {
      const newUser = await userService.createUser({
        ...body,
        id: userApi.data.user.id,
        role: ROLE.STAFFER,
        companyProfileId: user.companyProfileId,
        username: body.email,
        hasFinishedProfile: true
      });
      if (saveToken && newUser) {
        const message = constractStafferEmail(
          body.firstName,
          body.email,
          token
        );
        sgMail.send(message);
        return newUser;
      }
    }
  }
  // return false;
}

async function renderNewStafferPassword(req) {
  if (req.params.token && req.params.token) {
    const exists = await otherService.getToken(req.params.token);
    if (exists) {
      return {
        ...req.params,
        verified: true,
        passwordChanged: false,
        processed: false
      };
    }
  }
  return {
    ...req.params,
    verified: false,
    passwordChanged: false,
    processed: false
  };
}

async function renderNewApplicantPassword(req) {
  if (req.params.token && req.params.token) {
    const exists = await otherService.getToken(req.params.token);
    if (exists) {
      return {
        ...req.params,
        verified: true,
        passwordChanged: false,
        processed: false
      };
    }
  }
  return {
    ...req.params,
    verified: false,
    passwordChanged: false,
    processed: false
  };
}

async function changeNewStafferPassword(body, token) {
  // console.log(token);
  const user = await userService.getUserByEmail(body.email);
  if (user) {
    // const updatedUser = await userService.updateUserField(bcryptjs.hashSync(body.password, 10), 'password', user.id);
    const updatedUser = await userService.updateUserById(user.id, {
      password: bcryptjs.hashSync(body.password, 10),
      emailVerified: true
    });
    const updateToken = await otherService.updateToken(token, {
      expired: true
    });
    if (updatedUser && updateToken) {
      return true;
    }
  }

  return false;
}

async function getAdvertisementOfToday() {
  const now = moment()
    .utc()
    .format();
  const endDay = moment()
    .add(1, "days")
    .utc()
    .format();
  // console.log(now);
  // console.log(endDay, 'dea')
  const ads = await otherService.getAdsByRanges(now, endDay);
  if (ads) {
    return ads;
  }
}

async function getVertialAdvertisementOfToday() {
  const now = moment()
    .utc()
    .format();
  const endDay = moment()
    .add(1, "days")
    .utc()
    .format();
  // console.log(now);
  // console.log(endDay, 'dea')
  const ads = await otherService.getVertialAdsByRanges(now, endDay);
  if (ads) {
    return ads;
  }
}

async function getAllAds(page, pageSize) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const ads = await otherService.getAllAdsWithOffset(offset, limit);
  // console.log(ads)
  if (ads) {
    pager.totalItems = ads.count;
    pager.totalPages = Math.ceil(ads.count / pager.pageSize);
    return {
      pager,
      rows: ads.rows
    };
  }
}

async function getAllEmployers(page, pageSize) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  //console.log(offset)
  //console.log(pager)
  //const company_profile = await userService.getAllCompanyProfile();
  const employers = await userService.getCompanyWithOffsetAndLimit(
    offset,
    limit
  );
  if (employers) {
    pager.totalItems = employers.count;
    pager.totalPages = Math.ceil(employers.count / pager.pageSize);
    return {
      pager,
      rows: employers.rows
    };
  }
}

async function updateCheckReportById(id) {
  const report = await otherService.getReportById(id);
  if (report) {
    if (report.checked) {
      const checked = await otherService.updateReportField(
        false,
        "checked",
        id
      );
      if (checked[0] > 0) {
        return true;
      }
    } else {
      const checked = await otherService.updateReportField(true, "checked", id);
      if (checked[0] > 0) {
        return true;
      }
    }
  }

  return false;
}

async function verifyEmployerLicense(id) {
  const companyProfile = await userService.getCompanyProfileById(id);
  if (companyProfile) {
    if (companyProfile.verified) {
      const verified = await userService.updateCompanyField(false, "verified", id);
      const companyJob = await jobsService.getAllCompanyJob(companyProfile.id);
      if (companyJob) {
        companyJob.map(item => {
          const updatedJob = jobsService.editJobById(item.id, { active: 0 });
        });
      }
      if (verified[0] > 0) {
        return true;
      }
    } else {
      const verified = await userService.updateCompanyField(
        true,
        "verified",
        id
      );
      const companyJob = await jobsService.getAllCompanyJob(companyProfile.id);
      if (companyJob) {
        companyJob.map(item => {
          const updatedJob = jobsService.editJobById(item.id, { active: 1 });
        });
      }
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

async function getReportedIssueById(id) {
  const issue = await otherService.getReportedIssueById(id);

  if (issue) {
    return issue;
  }
}

async function reportById(id) {
  const report = await otherService.getReportById(id);
  if (report) {
    return report;
  }
}

async function getAllIssuesFromApplicants() {
  const issues = await otherService.getAllReportedApplicantIssues();
  if (issues) {
    return issues;
  }
}
async function getAllreportsFromApplicants() {
  const reports = await otherService.getAllReportedApplicant();
  if (reports) {
    return reports;
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
    const existingIssue = await otherService.getIssueById(
      issueResponse.issueId
    );
    if (existingIssue) {
      const savedIssueResponse = await otherService.addIssueResponse({
        ...issueResponse,
        userId
      });
      if (savedIssueResponse) {
        const updatedIssue = await otherService.updateIssueField(
          savedIssueResponse.id,
          "IssueResponseId",
          existingIssue.id
        );
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
  } else return {};
}

async function getSearchCountLocations() {
  let now = new Date()
    .toISOString()
    .toString()
    .split("T")[0];
  const queryCity = `select cityName,count(*) as count from view_companies_jobs_search where applicationStartDate <= "${now}" and applicationEndDate >= "${now}" GROUP BY cityName ORDER BY 2 DESC`;
  const cityNameCount = await jobsService.executeSearchQuery(queryCity);
  const queryJob = `select jobTitle,count(*) as count from view_companies_jobs_search where applicationStartDate <= "${now}" and applicationEndDate >= "${now}" GROUP BY jobTitle ORDER BY 2 DESC`;
  const jobNameCount = await jobsService.executeSearchQuery(queryJob);
  if (cityNameCount && jobNameCount) {
    //cityNameCount = cityNameCount.slice(0,18)
    return { city: cityNameCount.slice(0, 18), job: jobNameCount.slice(0, 18) };
  }
}

async function getAdvancedSearched(
  search,
  employType,
  industry,
  salaryRange,
  cityName,
  pwd,
  page,
  userId,
  role
) {
  const pager = {
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };

  // console.log(cityName, employType, industry, salaryRange, search, page, pwd, 'asd')
  if (cityName == "undefined") {
    cityName = "";
  }
  if (industry == "undefined") {
    industry = "";
  }
  if (salaryRange == "undefined") {
    salaryRange = "";
  }

  //console.log(search, employType, industry, cityName, page)
  const offset = (page - 1) * pager.pageSize;

  const limit = pager.pageSize;

  queryResult = advancedSearchQueryBuilder(
    search || "",
    employType || "",
    industry || "",
    salaryRange || "",
    cityName || "",
    pwd,
    offset || 0,
    limit || 8
  );
  //console.log(queryResult)
  // console.log(queryResult.count);

  let jobs = await jobsService.executeSearchQuery(queryResult.selectQuery);
  let savedIds = [];
  //console.log(jobs)
  if (jobs) {
    if (userId && role == ROLE.APPLICANT) {
      const savedJobs = await JobsController.getApplicantSavedReviewJobs(
        userId
      );
      savedIds = savedJobs.map(sj => sj.id);
    }
    jobs = jobs.map(j => {
      j["saved"] = savedIds.indexOf(j.jobId) >= 0;
      return j;
    });
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

function advancedSearchQueryBuilder(
  search,
  employType,
  industry,
  salaryRange,
  cityName,
  pwd,
  offset,
  limit
) {
  // console.log(pwd, 'pwd')
  let now = new Date()
    .toISOString()
    .toString()
    .split("T")[0];
  let query = ``;
  let haveWhere = false;
  if (pwd) {
    query = query + ` where pwd='${pwd}'`;
    haveWhere = true;
  }
  if (employType != "") {
    if (haveWhere) {
      query = query + ` and employmentType like '%${employType}%'`;
      haveWhere = true;
    } else {
      query = query + ` where employmentType like '%${employType}%'`;
    }
  }
  if (industry != "") {
    if (haveWhere) {
      query = query + ` and industry like '%${industry}%'`;
    } else {
      query = query + ` where industry like '%${industry}%'`;
      haveWhere = true;
    }
  }
  if (salaryRange != "") {
    if (haveWhere) {
      query = query + ` and salaryRange like '%${salaryRange}%'`;
    } else {
      query = query + ` where salaryRange like '%${salaryRange}%'`;
      haveWhere = true;
    }
  }
  if (cityName != "") {
    if (haveWhere) {
      query = query + ` and cityName like '%${cityName}%'`;
    } else {
      query = query + ` where cityName like '%${cityName}%'`;
      haveWhere = true;
    }
  }
  if (haveWhere) {
    query =
      query +
      `  and (jobTitle like '%${search}%'  or companyName like '%${search}%')`;
  } else {
    query =
      query +
      ` where and (jobTitle like '%${search}%' or companyName like '%${search}%')`;
  }

  if (!haveWhere) {
    query += ` where applicationStartDate <= "${now}" and applicationEndDate >= "${now}"`;
  } else {
    query += ` AND applicationStartDate <= "${now}" and applicationEndDate >= "${now}"`;
  }
  let selectQuery =
    `select * from view_companies_jobs_search ` +
    query +
    ` order by createdAt desc LIMIT ${offset},${limit}`;
  let QueryCount = `SELECT COUNT(*) FROM view_companies_jobs_search` + query;
  return { selectQuery: selectQuery, count: QueryCount };
}

async function getFeaturedCompaniesHandler() {
  const companies = await otherService.getFeaturedCompanies();
  if (!companies) {
    throw "something went wrong";
  }

  return companies;
}

async function getExemptCompaniesHandler(page, pageSize) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const company = await otherService.getExemptCompanies(offset, limit);

  if (!company) {
    throw "something went wrong";
  }
  pager.totalItems = company.count;
  pager.totalPages = Math.ceil(company.count / pager.pageSize);
  return { company: company.rows, pager: pager };
}

async function addRemoveExemptCompanyHandler(id) {
  const company = await userService.getCompanyProfileById(id);
  if (!company) {
    return false;
  }
  const featured = userService.updateCompanyField(
    company.exempt ? 0 : 1,
    "exempt",
    id
  );

  if (featured) {
    return true;
  }

  return false;
}

async function addRemoveFeaturedCompanyHandler(id) {
  const company = await userService.getCompanyProfileById(id);
  if (!company) {
    return false;
  }

  if (!company.featured) {
    const companies = await otherService.getFeaturedCompanies();
    if (companies.length >= 8) {
      throw "maximum_featured_companies_reached";
    }
  }

  const featured = userService.updateCompanyField(
    company.featured ? 0 : 1,
    "featured",
    id
  );

  if (featured) {
    return true;
  }

  return false;
}

async function getAdsOneById(id) {
  const ads = await otherService.getAdsById(id);
  if (ads) {
    return ads;
  }
}
async function editAdvertisementById(id, body) {
  const ads = await otherService.getAdsById(id);
  if (ads) {
    const updatedJob = otherService.editAdsById(id, body);
    if (updatedJob) {
      //console.log(updatedJob)
      return updatedJob;
    }
  }
}
async function deactivateAdsById(id) {
  const ads = await otherService.getAdsById(id);
  if (ads.active) {
    const deactivated = await userService.updateAdsField(0, "active", id);
    if (deactivated[0] > 0) {
      return true;
    }
  } else {
    const deactivated = await userService.updateAdsField(1, "active", id);
    if (deactivated[0] > 0) {
      return true;
    }
  }
  if (deactivated[0] > 0 && ads) {
    // console.log(user)
    return ads;
  }
}

module.exports = {
  getAdminDashboardCounts,
  getApplicantReport,
  getApplicantReportFilter,
  getEmployerReport,
  getEmployerReportFilter,
  getEmployerJobReportFilter,
  getEmployerDashboardCounts,
  getApplicantDashboardCounts,
  getAllIndustries,
  getAdminIssueStats,
  addEmpIssue,
  getEmpIssues,
  addIssue,
  addReports,
  getIssues,
  getIssue,
  deleteEmpIssue,
  deleteAppIssue,
  getEmpIssueById,
  getAdminStaff,
  addAdminStaff,
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
  getIssueById,
  getApplicantIssuesAdmin,
  getCompanyIssuesAdmin,
  addIssueResponse,
  getStaffsCompany,
  addStaffsCompany,
  searchIndustry,
  advancedSearchJob,
  getApplicantReports,
  getFeaturedCompanies,
  getExemptCompanies,
  addRemoveFeaturedCompany,
  addRemoveExemptCompany,
  getReportById,
  checkReport,
  adminAddAds,
  adminGetAllAds,
  deactivateAds,
  editAdvertisement,
  getAdvertisement,
  searchCountLocations,
  getAdsById,
  getVerticalAdvertisement
};
