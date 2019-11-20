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

async function getCityByRegionId(regionId){
    return await City.findAll({where: {regionId}}).catch(err => console.log(err));
}

async function addLocation(location){
    return await Location.create(location).catch(err => console.log(err));
}

async function getCities(){
    return await City.findAll().catch(err => console.log(err));
}

async function getRegions(){
    return await Region.findAll().catch(err => console.log(err));
}

async function getCountries(){
    return await Country.findAll().catch(err => console.log(err));
}

async function getCompanyLocations(companyProfileId){
    return await Location.findAll({where: {companyProfileId}}).catch(err => console.log(err));
}

async function updateLocation(location, newLocation){
    return await location.update(newLocation);
}


module.exports = {
    getLocationById,
    getCities,
    getRegions,
    getCountries,
    addLocation,
    getCityByRegionId,
    getCompanyLocations,
    updateLocation
}