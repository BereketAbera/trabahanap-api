const locationService = require('../services/location.service');
const userService = require('../services/user.service');
const {validateLocation} = require('../_helpers/validators');

function addLocation(req, res, next){
    const valid = validateLocation(req.body);

    if(valid != true){
        res.status(200).json({success: false, validationError: valid});
        return;
    }

    addCompanyLocation({...req.body, cityId: req.body.CityId, regionId: req.body.RegionId, countryId: req.body.CountryId})
        .then(location => res.status(200).send({success: true, location}))
        .catch(err => next(err));
}

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

async function addCompanyLocation(location){
    const companyProfile = await userService.getCompanyProfileById(location.companyProfileId).catch(err => console.log);
    if(companyProfile){
        const newLocation = await locationService.addLocation(location).catch(err => console.log(err));
        if(newLocation){
            return newLocation;
        }
    }
}


module.exports = {
    getAllCities,
    getAllRegions,
    getAllCountries,
    addLocation
}