const locationService = require('../services/location.service');
const userService = require('../services/user.service');
const {validateLocation} = require('../_helpers/validators');

function addLocation(req, res, next){
    console.log(req.body);
    // const valid = validateLocation(req.body);

    // if(valid != true){
    //     res.status(200).json({success: false, validationError: valid});
    //     return;
    // }

    // addCompanyLocation({...req.body, cityId: req.body.CityId, regionId: req.body.RegionId, countryId: req.body.CountryId})
    //     .then(location => res.status(200).send({success: true, location}))
    //     .catch(err => next(err));
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

function getRegionCities(req, res, next){
    getCitiesByRegionsId(req.params.regionId)
        .then(cities => res.status(200).send({success: true, cities}))
        .catch(err => next(err));
}

function getCompanyLocations(req, res, next){
    getLocationByCompanyProfileId(req.params.companyProfileId, req.user.sub)
        .then(locations => res.status(200).send({success: true, locations}))
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

async function getCitiesByRegionsId(regionId){
    const cities = await locationService.getCityByRegionId(regionId);
    if(cities){
        return cities;
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

async function getLocationByCompanyProfileId(companyProfileId, user_id){
    const user = await userService.getUserById(user_id);
    if(user){
        if(user.company_profile.id == companyProfileId){
            const locations = await locationService.getCompanyLocations(companyProfileId).catch(err => console.log(err));
            if(locations){
                return locations;
            }
        }
    }
}


module.exports = {
    getAllCities,
    getAllRegions,
    getAllCountries,
    addLocation,
    getRegionCities,
    getCompanyLocations
}