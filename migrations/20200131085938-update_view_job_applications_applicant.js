"use strict";
const view_name = "view_job_applications_applicant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query =
      "ALTER VIEW view_job_applications_applicant AS (SELECT ja.filtered,ja.hired,ja.applicationDate,j.jobTitle,j.active,j.jobDescription,j.industry,j.position,j.educationAttainment,j.salaryRange,j.employmentType,j.additionalQualifications,j.vacancies,j.applicationStartDate,j.applicationEndDate,j.createdAt,j.updatedAt,cp.companyLogo, cp.companyName,cp.companyDescription,u.firstName,u.lastName,u.phoneNumber,u.email,a.id as applicantId, a.applicantPicture, j.id as jobId,cp.id as companyProfileId FROM job_applications ja LEFT JOIN jobs j ON ja.JobId=j.id LEFT JOIN company_profiles cp ON ja.CompanyProfileId = cp.id LEFT JOIN applicant_profiles a ON a.id = ja.ApplicantProfileId LEFT JOIN users u ON a.UserId = u.id where j.active = 1 )";
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
