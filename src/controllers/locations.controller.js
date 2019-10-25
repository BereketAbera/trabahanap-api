const locationService = require('../services/location.service');

function getAllCities(req, res, next){
    locationService.getAllCities()
        .then(cities => res.status(200).send({success: true, cities}))
        .catch(err => next(err));
}

function getAllRegions(req, res, next){
    locationService.getAllRegions()
        .then(regions => res.status(200).send({success: true, regions}))
        .catch(err => next(err));
}

function getAllCountries(req, res, next){
    locationService.getAllCountries()
        .then(countries => res.status(200).send({success: true, countries}))
        .catch(err => next(err));
}


module.exports = {
    getAllCities,
    getAllRegions,
    getAllCountries
}