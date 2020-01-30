'use strict';
const view_name = "view_jobs_saved_review_later";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = 'CREATE VIEW view_jobs_saved_review_later AS (SELECT j.id,j.jobTitle,j.active,j.jobDescription,j.industry,j.position,j.educationAttainment,j.salaryRange,j.employmentType,j.additionalQualifications,j.vacancies,j.applicationStartDate,j.applicationEndDate,j.pwd,jl.createdAt,jl.updatedAt,cp.companyName, cp.contactNumber, cp.industryType, cp.companyLogo, cp.companyAddress,jl.ApplicantProfileId,jl.id as jobId FROM job_later_reviews jl  LEFT JOIN jobs j ON j.id = jl.JobId LEFT JOIN company_profiles cp ON cp.id = j.companyProfileId where j.active = 1 )';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
