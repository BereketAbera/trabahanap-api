const sequelize = require('../database/connection');

const User = sequelize.import("./users.js");
const CompanyProfile = sequelize.import("./company_profiles.js");
const ApplicantProfile = sequelize.import("./applicant_profiles.js");
const City = sequelize.import("./cities.js");
const Region = sequelize.import("./regions.js");
const Country = sequelize.import("./countries.js");
const Job = sequelize.import("./jobs.js");
const Location = sequelize.import("./locations.js");
const JobApplication = sequelize.import("./job_applications.js");
const Indutry = sequelize.import("./industries.js");
const JobLaterReview = sequelize.import("./job_later_reviews.js");
const Issue = sequelize.import("./issues.js");
const IssueResponse = sequelize.import("./issue_responses.js");
const Token = sequelize.import("./tokens.js");
const Reports = sequelize.import("./reports.js");
const Advertisement = sequelize.import("./Advertisement.js")
const ApplicantReport = sequelize.import("./applicant_reports.js")
const EmployerReport = sequelize.import("./employer_reports.js")

ApplicantProfile.belongsTo(User);
ApplicantProfile.belongsTo(City);
ApplicantProfile.belongsTo(Region);
ApplicantProfile.belongsTo(Country);

CompanyProfile.belongsTo(City);
CompanyProfile.belongsTo(Region);
CompanyProfile.belongsTo(Country);

User.belongsTo(CompanyProfile);

City.belongsTo(Region);

Region.belongsTo(Country);

Location.belongsTo(CompanyProfile);
Location.belongsTo(City);
Location.belongsTo(Region);
Location.belongsTo(Country);

JobApplication.belongsTo(CompanyProfile);
JobApplication.belongsTo(ApplicantProfile);
JobApplication.belongsTo(Job);

Job.belongsTo(CompanyProfile);
Job.belongsTo(Location);
Job.hasMany(JobApplication);
Job.belongsTo(User);

JobLaterReview.belongsTo(ApplicantProfile);
JobLaterReview.belongsTo(Job);

Reports.belongsTo(ApplicantProfile);
Reports.belongsTo(Job);
Advertisement.belongsTo(User);
Issue.belongsTo(ApplicantProfile);
Issue.belongsTo(IssueResponse);
Issue.belongsTo(CompanyProfile);
// IssueResponse.belongsTo(Issue);
IssueResponse.belongsTo(User);

module.exports = {
    User,
    CompanyProfile,
    ApplicantProfile,
    City,
    Region,
    Country,
    Job,
    Location,
    JobApplication,
    Indutry,
    JobLaterReview,
    Issue,
    IssueResponse,
    Token,
    Reports,
    Advertisement,
    ApplicantReport,
    EmployerReport
}
