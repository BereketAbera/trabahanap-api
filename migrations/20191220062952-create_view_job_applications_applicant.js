'use strict';
const view_name="view_job_applications_applicant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = 'CREATE VIEW view_job_applications_applicant AS (SELECT j.jobTitle,ja.filtered,ja.hired,ja.applicationDate,j.jobDescription,j.industry,j.position,j.educationAttainment,j.salaryRange,j.employmentType,j.additionalQualifications,j.vacancies,j.applicationStartDate,j.applicationEndDate,j.createdAt,j.updatedAt,cp.companyLogo, cp.companyName,cp.companyDescription,u.firstName,u.lastName,u.phoneNumber,u.email,ja.ApplicantProfileId as applicantId, ja.companyProfileId as companyId, j.id as jobId,cp.id as companyProfileId FROM job_applications ja LEFT JOIN jobs j ON ja.JobId=j.id LEFT JOIN company_profiles cp ON j.CompanyProfileId = cp.id LEFT JOIN applicant_profiles a ON a.id = ja.ApplicantProfileId LEFT JOIN users u ON u.id = a.UserId)';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};

