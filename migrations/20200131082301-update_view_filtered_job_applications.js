"use strict";
const view_name = "view_filtered_job_applications";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const query =
      "ALTER VIEW view_filtered_job_applications AS (SELECT j.jobTitle,j.active, j.vacancies, j.position, j.applicationStartDate, j.applicationEndDate, cp.companyName, cp.industryType, j.id as jobId, cp.id as companyProfileId, (SELECT COUNT(*) FROM job_applications ja WHERE ja.JobId = j.id and ja.filtered = true) AS applicationsCount FROM jobs j LEFT JOIN company_profiles cp ON j.CompanyProfileId = cp.id where j.active = 1)";
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {}
};
