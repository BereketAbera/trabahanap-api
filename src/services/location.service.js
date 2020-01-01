const {
    Location,
    CompanyProfile,
    City,
    Region,
    Country
} = require('../models');

async function getLocationById(LocationId){
    const location = await Location.findOne({where: {id: LocationId}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
    if(location){
        return location;
    }
}

function getCityByRegionId(regionId){
    return City.findAll({where: {regionId}}).catch(err => console.log(err));
}

function addLocation(location){
    return Location.create(location).catch(err => console.log(err));
}

function getCities(){
    return City.findAll().catch(err => console.log(err));
}

function getRegions(){
    return Region.findAll().catch(err => console.log(err));
}

function getCountries(){
    return Country.findAll().catch(err => console.log(err));
}

function getCompanyLocations(companyProfileId){
    return Location.findAll({where: {companyProfileId}}).catch(err => console.log(err));
}

async function getCompanyLocationsByOffsetAndLimit(offset, limit, companyProfileId){
 return await Location.findAndCountAll({where: {companyProfileId}, offset, limit, order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function updateLocation(location, newLocation){
    return location.update(newLocation);
}


module.exports = {
    getLocationById,
    getCities,
    getRegions,
    getCountries,
    addLocation,
    getCityByRegionId,
    getCompanyLocations,
    updateLocation,
    getCompanyLocationsByOffsetAndLimit
}