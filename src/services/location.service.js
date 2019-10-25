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

async function createLocation(location){
    const loc = await Location.create(location).catch(err => console.log(err));
    if(loc){
        return loc;
    }
}

async function getAllCities(){
    const cities = await City.findAll().catch(err => console.log(err));
    if(cities){
        return cities;
    }
}

async function getAllRegions(){
    const regions = await Region.findAll().catch(err => console.log(err));
    if(regions){
        return regions;
    }
}

async function getAllCountries(){
    const countries = await Country.findAll().catch(err => console.log(err));
    if(countries){
        return countries;
    }
}



module.exports = {
    getLocationById,
    createLocation,
    getAllCities,
    getAllRegions,
    getAllCountries
}