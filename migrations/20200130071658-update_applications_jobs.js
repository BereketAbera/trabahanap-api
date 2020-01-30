'use strict';
const view_name = "view_applicant_applied_jobs";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  },

  down: (queryInterface, Sequelize) => {
    const query = 'CREATE VIEW view_applicant_applied_jobs AS (SELECT j.id,j.jobTitle,j.active,j.jobDescription,j.industry,j.position,j.educationAttainment,j.salaryRange,j.employmentType,j.additionalQualifications,j.vacancies,j.applicationStartDate,j.applicationEndDate,j.pwd,j.createdAt,j.updatedAt,cp.companyName, cp.contactNumber, cp.industryType, cp.companyLogo, cp.companyAddress,ja.hired,ja.ApplicantProfileId,ja.applicationDate from job_applications ja LEFT JOIN jobs j ON j.id = ja.jobId LEFT JOIN company_profiles cp ON cp.id = j.companyProfileId where j.active = 1 )';
    return queryInterface.sequelize.query(query);

  }
};
