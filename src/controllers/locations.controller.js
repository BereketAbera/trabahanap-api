var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
const _ = require('lodash');
// var credentials = {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// };
var credentials = new AWS.SharedIniFileCredentials({ profile: 'liguam' });
AWS.config.credentials = credentials;
// Set the region 
AWS.config.update({ region: 'us-west-2' });
// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
var moment = require('moment');
var formidable = require('formidable');
const CONSTANTS = require('../../constants');

const locationService = require('../services/location.service');
const userService = require('../services/user.service');
const {validateLocation} = require('../_helpers/validators');

function addLocationWithImage(req, res, next){
    let localImagePath = "";
    let location = {};
    let fileName = ""
    let userId = req.user.sub;
    var form = new formidable.IncomingForm();
    form.on('fileBegin', (name, file) => {
      let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
      fileName = moment().format("YYYYMMDDHHmmssSS");
      file.path = CONSTANTS.baseDir + '/uploads/' + fileName + "." + fileExt;
      localImagePath = file.path;
    });
    form.on('file', function (name, file) {
      console.log('Uploaded ' + file.name);
    });
    form.parse(req, function (err, fields, files) {
        _.map(fields, (value, key) => {
            location[key] = value;
        });
        location["CityId"] = location.cityId;
        location["RegionId"] = location.regionId;
        location["CountryId"] = location.countryId;
        const valid = validateLocation(location);
        if(valid != true){
            res.status(200).json({success: false, validationError: valid});
            return;
        }
        processFileUpload(userId, location, fileName, localImagePath)
            .then(location => {
                fs.unlinkSync(localImagePath);
                res.status(200).send({success: true, location})
            })
            .catch(err => next(err));
    });
}

function getLocation(req, res, next){
    getCompanyLocationById(req.params.id, req.user.sub)
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
    location.isHeadOffice = location.isHeadOffice == 'false' ? false : true;
    const companyProfile = await userService.getCompanyProfileById(location.companyProfileId).catch(err => console.log);
    if(companyProfile){
        const newLocation = await locationService.addLocation(location).catch(err => console.log(err));
        if(newLocation){
            const newComapanyProfile = await companyProfile.update({hasLocations: true});
            if(newComapanyProfile){
                return newLocation;
            }   
        }
    }
}

async function getLocationByCompanyProfileId(companyProfileId, user_id){
    const user = await userService.getUserById(user_id);
    if(user){
        if(user.company_profile.id == companyProfileId){
            const location = await locationService.getCompanyLocations(companyProfileId).catch(err => console.log(err));
            if(location){
                return location;
            }
        }
    }
}


async function processFileUpload(userId, location, fileName, localImagepath) {
    const imgObj = await uploadFile(localImagepath, 'th-employer-logo', fileName)
    location.bucket = 'th-employer-logo';
    location.picture = imgObj.Location;
    location.awsFileKey = fileName;
    return addCompanyLocation(location);
}

function uploadFile(file, bucketName, fileName) {
    return uploadFilePromise(file, bucketName, fileName).then(data => {
      return data;
    });
}

function uploadFilePromise(file, bucketName, fileName) {
    var uploadParams = { Bucket: bucketName, Key: fileName, Body: '', ACL: 'public-read' };
    var fileStream = fs.createReadStream(file);
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);
    return new Promise((resolve, reject) => {
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          reject(err)
        } if (data) {
          resolve(data);
        } else {
          reject("system error");
        }
      });
    });
}

async function getCompanyLocationById(id, userId){
    const user = await userService.getUserById(userId);
    if(user && user.role == "EMPLOYER" && user.company_profile){
        const location = await locationService.getLocationById(id);
        if(location.companyProfileId == user.companyProfileId){
            return location;
        }
    }
}

module.exports = {
    getAllCities,
    getAllRegions,
    getAllCountries,
    getRegionCities,
    getCompanyLocations,
    addLocationWithImage,
    getLocation
}