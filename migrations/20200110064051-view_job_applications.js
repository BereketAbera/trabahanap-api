'use strict';
const view_name = 'view_job_applications';
module.exports = {
  
  up: (queryInterface, Sequelize) => {
    const query = 'CREATE VIEW view_job_applications AS (SELECT j.jobTitle,j.active, j.position,j.createdAt, cp.companyName, cp.industryType, j.id as jobId, cp.id as companyProfileId, (SELECT COUNT(*) FROM job_applications ja WHERE ja.JobId = j.id) AS applicationsCount FROM jobs j LEFT JOIN company_profiles cp ON j.CompanyProfileId = cp.id where j.active = 1)';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
