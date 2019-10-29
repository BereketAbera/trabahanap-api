const locationService = require('../services/location.service');

function getAllCities(req, res, next){
    getCities()
        .then(cities => res.status(200).send({success: true, cities}))
        .catch(err => next(err));
}

function getAllRegions(req, res, next){
    getRegions()
        .then(regions => res.status(200).send({success: true, regions}))
        .catch(err => next(err));
}

function getAllCountries(req, res, next){
    getCountries()
        .then(countries => res.status(200).send({success: true, countries}))
        .catch(err => next(err));
}


async function getCities(){
    const cities = await locationService.getCities();
    if(cities){
        return cities;
    }
}

async function getRegions(){
    const regions = await locationService.getRegions();
    if(regions){
        return regions;
    }
}

async function getCountries(){
    const countries = await locationService.getCountries();
    if(countries){
        return countries;
    }
}


module.exports = {
    getAllCities,
    getAllRegions,
    getAllCountries
}