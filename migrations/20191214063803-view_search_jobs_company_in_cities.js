'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const query = 'CREATE VIEW view_companies_jobs_search AS (SELECT j.jobTitle, j.position, j.jobDescription, j.industry,j.vacancies,j.applicationStartDate, j.applicationEndDate,j.salaryRange, j.employmentType,cp.companyLogo, cp.companyName,cp.companyDescription, cp.industryType, l.locationName,l.latitude,l.longitude,l.CityId, c.cityName, l.RegionId, j.id as jobId,cp.id as companyProfileId  FROM jobs j LEFT JOIN company_profiles cp ON j.CompanyProfileId = cp.id LEFT JOIN locations l ON l.id = j.LocationId LEFT JOIN cities c ON c.id = l.CityId)';
    return queryInterface.sequelize.query(query);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
