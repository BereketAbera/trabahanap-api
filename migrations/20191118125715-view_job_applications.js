'use strict';
const view_name = 'view_job_applications';
module.exports = {
  
  up: (queryInterface, Sequelize) => {
    const query = 'SELECT j.jobTitle, j.position, ja.applicationDate, cp.companyName, cp.industryType, ap.UserId, u.email, u.username FROM job_applications ja LEFT JOIN jobs j ON j.id = ja.JobId LEFT JOIN company_profiles cp ON ja.CompanyProfileId = cp.id LEFT JOIN  applicant_profiles ap ON ja.ApplicantProfileId = ap.id LEFT JOIN users u ON u.id = ap.UserId';
    return queryInterface.sequelize.query(`CREATE VIEW ${view_name} AS ${query}`);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
