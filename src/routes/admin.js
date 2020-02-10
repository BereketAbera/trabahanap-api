const app = module.exports = require('express')();
const otherController = require('../controllers/other.controller');
const userController = require('../controllers/users.controller');
const locationController = require('../controllers/locations.controller')
const jobsController = require('../controllers/jobs.controller')
const adminAuthorize = require('../_helpers/adminAuthorize');
const ROLE = require('../_helpers/role');

app.get('/counters', otherController.getAdminDashboardCounts);
app.get('/employers', otherController.getEmployers);
app.post('/employers',userController.admnCreateCompanyProfileWithBusinessLicenseAndLogo);
app.put('/employers/verify/:id', otherController.verifyEmployer);

app.get('/issue-counter', otherController.getAdminIssueStats);
app.get('/issue/:id', otherController.getIssueById);
app.get('/issues/applicant', otherController.getApplicantIssuesAdmin);
app.get('/issues/employer', otherController.getCompanyIssuesAdmin);
app.post('/issue_responses', otherController.addIssueResponse);
app.get('/reports',otherController.getApplicantReports);
app.get('/report/:id',otherController.getReportById);
app.put('/report/check/:id',otherController.checkReport);

app.post('/staff/add', adminAuthorize(ROLE.ADMIN), otherController.addAdminStaff);
app.get('/staff', adminAuthorize(ROLE.ADMIN), otherController.getAdminStaff);
app.put('/staff/:id',adminAuthorize(ROLE.ADMIN),userController.deactivateUser)

app.post('/applicants', userController.createApplicant);
app.get('/applicants', userController.getApplicants);
app.put('/applicants/:id',userController.deactivateUser);
app.get('/applicant/:id',userController.getApplicantById);
app.get('/applications', jobsController.getAllApplications);

app.get('/employers/featured', otherController.getFeaturedCompanies);
app.get('/employers/featured/:id/toggle', otherController.addRemoveFeaturedCompany);

app.post('/location', locationController.addLocationWithImage);
app.post('/jobs/:companyProfileId', jobsController.adminAddJob);
app.put('/jobs/:id', jobsController.editCompanyJob);
app.get('/location/:companyProfileId',locationController.getLocationByCompanyProfile);
app.get('/location/details/:id', locationController.getLocationById);
app.put('/location/details/:id', locationController.updateLocationByAdmin);
app.put('/location/details/picture/:id', locationController.updateLocationPicture);
app.get('/location/company/:companyProfileId',locationController.getLocatiosForCompany);
app.get('/jobs/:companyProfileId',jobsController.adminGetAllCompanyJob);
app.get('/employers/:companyProfileId',otherController.getCompanyDetails);
app.get('/employers/applicant/:companyProfileId',jobsController.getCompanyApplicant);
app.get('/staff/:companyProfileId',otherController.getStaffsCompany);
app.post('/staff/:companyProfileId',otherController.addStaffsCompany);
app.get('/jobs', jobsController.adminGetAllJobs);
app.put('/jobs/delete/:id',jobsController.deleteJob);

app.get('/filter/jobs',jobsController.adminGetAllCompanyJobFilters);
app.get('/filter/applications',jobsController.adminGetAllApplicationsFilters);
app.get('/filter/employers',jobsController.adminGetAllEmployersFilters);
app.get('/filter/applicants',jobsController.adminGetAllApplicantFilters);

app.post('/advertisement',otherController.adminAddAds);
app.get('/advertisement',otherController.adminGetAllAds);
app.put('/advertisement/:id',otherController.deactivateAds);