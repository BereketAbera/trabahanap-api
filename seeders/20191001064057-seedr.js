'use strict';
const faker = require('faker');
const bcryptjs = require('bcryptjs');

const ROLES = ['ADMIN', 'EMPLOYER', 'APPLICANT'];

console.log("running seedr");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let countries = [
      {
        countryName: "Philippines",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('countries', countries, {});

    const countryIds = await queryInterface.sequelize.query(
      `SELECT id from countries;`
    );
    let regions = [];
    // let rleft = ["Northern Mindanao", "Soccsksargen", "Westerb Visayas", "Zanboanga"];
    let r = ["ARMM", "Bicol", "Cagayan", "Calabarzon", "CAR", "Caraga", "Central Luzon", "Central Visayas", "Davao", "Eastern Visayas", "Ilocos", "Mimaraopa", "NCR"];
    for(var i = 0; i<r.length; i++){
      var region = {
        regionName: r[i],
        CountryId: countryIds[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      regions.push(region);
    }

    let c = [
      ["Basilan", "Lanao del Sur", "Maguindanao", "Sulu", "Tawi-Tawi"], 
      ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Naga", "Sorsogon"], 
      ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino", "Santiago"], 
      ["Batangas", "Cavite", "Laguna", "Lucena", "Quezon", "Rizal"], 
      ["Abra", "Apayao", "Baguio", "Ifugao", "Kalinga", "Mt. Province"],
      ["Agusan del Norte", "Agusa del Sur", "Butuan", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
      ["Angeles", "Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Olongapo", "Pampanga", "Tarlac", "Zambales"],
      ["Bohol", "Cebu", "Cebu City", "Lapu Lapu", "Negros Oriental", "Siquijor"],
      ["Compostela Valley", "Davao City", "Davao del Norte", "Davao del Sur", "Davao Oriental"],
      ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Ormoc", "Samar", "Southern Leyte", "Tacloban"],
      ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
      ["Marindugue", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Puerto Princesa", "Romblon"],
      ["Caloocan", "Las Pinas", "Makati", "Malabon", "Mandaluyong", "Manila", "Marikina", "Muntinlupa", "Navotas", "Paranaque", "Pasay", "Pasig", "Pateros", "Quezon City", "San Juan", "Taguig", "Valenzuela"]
    ]

    await queryInterface.bulkInsert('regions', regions, {});

    const regionIds = await queryInterface.sequelize.query(
      `SELECT id from regions;`
    );

    let cities = [];
    let cityId = 0;
    for(var i = 0; i<r.length; i++){
      for(var j = 0; j<c[i].length; j++){
        cityId = cityId + 1;
        var city = {
          cityName: c[i][j],
          RegionId: regionIds[0][i].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        cities.push(city);
      }
      

    }

    await queryInterface.bulkInsert('cities', cities, {});

    const cityIds = await queryInterface.sequelize.query(
      `SELECT id from cities;`
    );
    
    let companyProfiles = [];
    for(var i = 0; i<15; i++){
      var companyProfile = {
        id: faker.random.uuid(),
        zipcode: faker.address.zipCode(),
        companyName: faker.company.companyName(),
        contactPerson: faker.name.firstName() + ' ' + faker.name.lastName(),
        contactNumber: faker.random.number(),
        websiteURL: faker.internet.url(),
        industryType: faker.commerce.department(),
        companyLogo: faker.image.business(),
        companyDescription: faker.lorem.paragraph(),
        businessLicense: faker.internet.url(),
        businessLicenseNumber: faker.random.number(),
        companyAddress: faker.address.streetAddress(),
        CityId: cityIds[0][getRandomInt(cityIds[0].length-1)].id,
        RegionId: regionIds[0][getRandomInt(regionIds[0].length-1)].id,
        CountryId: countryIds[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      companyProfiles.push(companyProfile);

    }

    await queryInterface.bulkInsert('company_profiles', companyProfiles, {});

    const companyProfileIds = await queryInterface.sequelize.query(
      `SELECT id from company_profiles;`
    );

    let users = [];
    for(var i = 0; i<15; i++){
      var genders = ['MALE', 'FEMALE'];
      var role = ROLES[i%3];
      var user = {
        id: faker.random.uuid(),
        username: faker.name.firstName().toLocaleLowerCase(),
        phoneNumber: faker.phone.phoneNumberFormat(),
        password: bcryptjs.hashSync('password', 10),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: genders[i%2],
        role: role,
        lastLoggedIn: new Date(),
        emailVerified: false,
        CompanyProfileId: role == 'EMPLOYER' ? companyProfileIds[0][getRandomInt(companyProfileIds[0].length-1)].id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      users.push(user);
    }

    await queryInterface.bulkInsert('users', users, {});

    const employersCompanyId = await queryInterface.sequelize.query(
      `SELECT CompanyProfileId from users where role='EMPLOYER';`
    );

    let jobs = [];
    for(var i = 0; i<55; i++){
      var eduAtain = ['Highschool', 'College', 'University', 'Degree', 'Deploma'];
      var salRange = ['<500', '500-1000', '1000-5000', '5000-10000', '>10000'];
      var d = new Date();
      var empType = ['FULLTIME', 'PARTTIME'];
      var job = {
        id: faker.random.uuid(),
        jobTitle: faker.random.words(),
        jobDescription: faker.lorem.paragraph(),
        industry: faker.commerce.department(),
        position: faker.company.bs(),
        educationAttainment: eduAtain[getRandomInt(4)],
        salaryRange: salRange[getRandomInt(4)],
        vacancies: getRandomInt(10),
        employmentType: empType[getRandomInt(1)],
        additionalQualifications: faker.lorem.paragraph(),
        applicationStartDate: new Date(),
        applicationEndDate: new Date(d.getTime() + 864000000),
        CompanyProfileId: employersCompanyId[0][getRandomInt(employersCompanyId[0].length-1)].CompanyProfileId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      jobs.push(job);
    }

    await queryInterface.bulkInsert('jobs', jobs, {});

    let locations = [];
    for(var i = 0; i<10; i++){
      var location = {
        id: faker.random.uuid(),
        locationName: faker.random.words(),
        locationPhoneNumber: faker.phone.phoneNumberFormat(),
        isHeadOffice: false,
        address1: faker.address.streetAddress(),
        address2: faker.address.streetAddress(),
        CityId: cityIds[0][getRandomInt(cityIds[0].length-1)].id,
        RegionId: regionIds[0][getRandomInt(regionIds[0].length-1)].id,
        CountryId: countryIds[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      locations.push(location);
    }

    await queryInterface.bulkInsert('locations', locations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('jobs', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('company_profiles', null, {});
    await queryInterface.bulkDelete('cities', null, {});
    await queryInterface.bulkDelete('regions', null, {});
    await queryInterface.bulkDelete('countries', null, {});
  }
};


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}