var fs = require("fs");
var path = require("path");
var AWS = require("aws-sdk");
const _ = require("lodash");
// var credentials = {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// };
// var credentials = new AWS.SharedIniFileCredentials({ profile: "liguam" });
var ROLE = require("../_helpers/role");
// AWS.config.credentials = credentials;
// Set the region
AWS.config.update({ region: "us-west-2" });
// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });
var moment = require("moment");
var formidable = require("formidable");
const CONSTANTS = require("../../constants");

const locationService = require("../services/location.service");
const userService = require("../services/user.service");
const { validateLocation } = require("../_helpers/validators");

function addLocationWithImage(req, res, next) {
  let localImagePath = "";
  let location = {};
  let fileName = "";
  let userId = req.user.sub;
  var form = new formidable.IncomingForm();
  form.on("fileBegin", (name, file) => {
    let fileExt = file.name.substr(file.name.lastIndexOf(".") + 1);
    if (name == "picture") {
      fileName = moment().format("YYYYMMDDHHmmssSS");
      file.path = CONSTANTS.baseDir + "/uploads/" + fileName + "." + fileExt;
      localImagePath = file.path;
    }
  });
  form.on("file", function(name, file) {
    console.log("Uploaded " + file.name);
  });
  form.parse(req, function(err, fields, files) {
    _.map(fields, (value, key) => {
      location[key] = value;
    });

    const valid = validateLocation(location);
    if (valid != true) {
      res.status(200).json({ success: false, validationError: valid });
      return;
    }
    location = {
      ...location,
      CityId: location.cityId,
      RegionId: location.regionId,
      CountryId: location.countryId
    };
    if (localImagePath != "") {
      processFileUpload(userId, location, fileName, localImagePath)
        .then(location => {
          fs.unlinkSync(localImagePath);
          res.status(200).send({ success: true, location });
        })
        .catch(err => next(err));
    } else {
      processFileUpload(userId, location, fileName, localImagePath)
        .then(location => {
          res.status(200).send({ success: true, location });
        })
        .catch(err => next(err));
    }
  });
}

function updateLocationPicture(req, res, next) {
  var fileNameLocationPicture = "";
  var form = new formidable.IncomingForm();
  form.multiples = true;

  form.on("fileBegin", function(name, file) {
    let fileExt = file.name.substr(file.name.lastIndexOf(".") + 1);
    let fileName = "";
    fileName = fileNameLocationPicture = Date.now() + "location-picture";
    file.path = CONSTANTS.baseDir + "/uploads/" + fileName + "." + fileExt;
  });
  form.parse(req, (err, fields, files) => {
    var locationPicture = files["picture"];
    if (locationPicture && locationPicture.path) {
      uploadFilePromise(
        locationPicture.path,
        "live.jobsearch/th-employer-logo",
        fileNameLocationPicture
      )
        .then(data => {
          return updateCompanyLocation(
            { picture: data.Location },
            req.params.id,
            req.user.sub
          );
        })
        .then(location => {
          fs.unlinkSync(locationPicture.path);
          location
            ? res.status(200).json({ success: true, location })
            : res
                .status(200)
                .json({ sucess: false, error: "Something went wrong" });
        })
        .catch(err => next(err));
    } else {
      res.status(200).json({ success: false });
    }
  });
}

function updateLocationByAdmin(req, res, next) {
  updateCompanyLocation(req.body, req.params.id, req.user.sub)
    .then(location => res.status(200).send({ success: true, location }))
    .catch(err => next(err));
}

function updateLocation(req, res, next) {
  var fileNameLocationPicture = "";
  var form = new formidable.IncomingForm();
  form.multiples = true;
  //console.log('here')
  form.on("fileBegin", function(name, file) {
    let fileExt = file.name.substr(file.name.lastIndexOf(".") + 1);
    let fileName = "";
    if (name == "picture") {
      fileName = fileNameLocationPicture = Date.now() + "company-logo";
    }

    file.path = CONSTANTS.baseDir + "/uploads/" + fileName + "." + fileExt;
  });

  form.parse(req, (err, fields, files) => {
    let companyLocation = {};
    _.map(fields, (value, key) => {
      companyLocation[key] = value;
    });

    const valid = validateLocation(companyLocation);

    if (valid != true) {
      res.status(200).json({ success: false, validationError: valid });
      return;
    }

    // console.log('after')
    companyLocation = {
      ...companyLocation,
      CityId: companyLocation.cityId,
      RegionId: companyLocation.regionId,
      CountryId: companyLocation.countryId
    };

    let locationPictureFile = files["picture"];
    if (locationPictureFile) {
      // console.log(locationPictureFile.path, "the path")
      uploadFilePromise(
        locationPictureFile.path,
        "live.jobsearch/th-employer-logo",
        fileNameLocationPicture
      )
        .then(data => {
          companyLocation["picture"] = data.Location;
          return updateCompanyLocation(
            companyLocation,
            req.params.id,
            req.user.sub
          );
        })
        .then(location => {
          fs.unlinkSync(locationPictureFile.path);
          //console.log(companyProfile.companyProfile,'a')
          location
            ? res.status(200).json({ success: true, location })
            : res
                .status(200)
                .json({ sucess: false, error: "Something went wrong" });
        })
        .catch(err => next(err));
    } else {
      // if there the picture is not editted
      updateCompanyLocation(companyLocation, req.params.id, req.user.sub)
        .then(location => res.status(200).send({ success: true, location }))
        .catch(err => next(err));
    }
  });
  // updateCompanyLocation(req.body, req.params.id, req.user.sub)
  //     .then(location => res.status(200).send({ success: true, location }))
  //     .catch(err => next(err));
}

function getLocation(req, res, next) {
  getCompanyLocationById(req.params.id, req.user.sub)
    .then(location =>
      location
        ? res.status(200).json({ success: true, location })
        : res
            .status(200)
            .json({ success: false, error: "something went wrong" })
    )
    .catch(err => next(err));
}

function getHeadLocations(req, res, next) {
  getCompanyHeadLocations(req.user.sub)
    .then(heads =>
      heads
        ? res.status(200).json({ success: true, heads })
        : res
            .status(200)
            .json({ success: false, error: "something went wrong" })
    )
    .catch(err => next(err));
}

function getAllCities(req, res, next) {
  getCities()
    .then(cities => res.status(200).send({ success: true, cities }))
    .catch(err => next(err));
}

function getAllRegions(req, res, next) {
  getRegions()
    .then(regions => res.status(200).send({ success: true, regions }))
    .catch(err => next(err));
}

function getAllCountries(req, res, next) {
  getCountries()
    .then(countries => res.status(200).send({ success: true, countries }))
    .catch(err => next(err));
}

function getRegionCities(req, res, next) {
  getCitiesByRegionsId(req.params.regionId)
    .then(cities => res.status(200).send({ success: true, cities }))
    .catch(err => next(err));
}

function getCompanyLocations(req, res, next) {
  getLocationByCompanyProfileId(req.user.sub)
    .then(locations => res.status(200).send({ success: true, locations }))
    .catch(err => next(err));
}

function getLocatiosForCompany(req, res, next) {
  adminGetLocations(req.params.companyProfileId)
    .then(locations => res.status(200).send({ success: true, locations }))
    .catch(err => next(err));
}

function getLocationByCompanyProfile(req, res, next) {
  adminGetLocationsByCompanyProfileId(
    req.query.page || 1,
    req.query.pageSize || 3,
    req.params.companyProfileId
  )
    .then(locations => res.status(200).send({ success: true, locations }))
    .catch(err => next(err));
}

function getLocationById(req, res, next) {
  adminGetLocationById(req.params.id)
    .then(location =>
      location
        ? res.status(200).send({ success: true, location })
        : res.status(200).send({ success: false, location })
    )
    .catch(err => next(err));
}

async function getCities() {
  const cities = await locationService.getCities();
  if (cities) {
    return cities;
  }
}

async function getRegions() {
  const regions = await locationService.getRegions();
  if (regions) {
    return regions;
  }
}

async function getCountries() {
  const countries = await locationService.getCountries();
  if (countries) {
    return countries;
  }
}

async function getCitiesByRegionsId(regionId) {
  const cities = await locationService.getCityByRegionId(regionId);
  if (cities) {
    return cities;
  }
}

async function updateCompanyLocation(nLocation, locationId, user_id) {
  // const { CityId, RegionId, CountryId } = nLocation;
  // if (CityId) { nLocation.cityId = CityId }
  // if (RegionId) { nLocation.regionId = RegionId }
  // if (CountryId) { nLocation.countryId = CountryId }
  nLocation.isHeadOffice = nLocation.isHeadOffice == "false" ? false : true;
  //console.log(nLocation)
  var location = await locationService.getLocationById(locationId);
  var user = await userService.getUserById(user_id);
  if (location) {
    if (nLocation.isHeadOffice) {
      const locations = await locationService.getCompanyLocations(
        user.companyProfileId
      );
      locations.map(item => {
        const updateOther = locationService.updateLocation(item, {
          isHeadOffice: 0
        });
      });
    }
  }

  // console.log(user.role, "the role of the user", location.locationName)
  if (
    location &&
    user &&
    (location.CompanyProfileId == user.CompanyProfileId ||
      user.role === ROLE.ADMIN ||
      user.role === ROLE.ADMINSTAFF)
  ) {
    // console.log("about to edit your locations")
    var updatedLocation = await locationService.updateLocation(
      location,
      nLocation
    );
    if (updatedLocation) {
      return updatedLocation;
    }
  }
}

async function getLocationByCompanyProfileId(user_id) {
  const user = await userService.getUserById(user_id);
  if (user) {
    if (user.company_profile.id) {
      const location = await locationService
        .getCompanyLocations(user.company_profile.id)
        .catch(err => console.log(err));
      if (location) {
        return location;
      }
    }
  }
}

async function adminGetLocationById(id) {
  const location = await locationService
    .getLocationById(id)
    .catch(err => console.log(err));
  if (location) {
    return location;
  }
}

async function adminGetLocations(companyProfileId) {
  const location = await locationService
    .getCompanyLocations(companyProfileId)
    .catch(err => console.log(err));
  if (location) {
    return {
      location
    };
  }
}

async function adminGetLocationsByCompanyProfileId(
  page,
  pageSize,
  companyProfileId
) {
  const pager = {
    pageSize: parseInt(pageSize),
    totalItems: 0,
    totalPages: 0,
    currentPage: parseInt(page)
  };
  const offset = (page - 1) * pager.pageSize;
  const limit = pager.pageSize;

  const location = await locationService
    .getCompanyLocationsByOffsetAndLimit(offset, limit, companyProfileId)
    .catch(err => console.log(err));

  if (location) {
    pager.totalItems = location.count;
    pager.totalPages = Math.ceil(location.count / pager.pageSize);
    const company_profile = await userService.getCompanyProfileById(
      companyProfileId
    );
    return {
      company_profile,
      pager,
      rows: location.rows
    };
  }
}

async function processFileUpload(userId, location, fileName, localImagepath) {
  if (localImagepath != "") {
    const imgObj = await uploadFile(
      localImagepath,
      "th-employer-logo",
      fileName
    );
    // location.bucket = 'th-employer-logo';
    location.picture = imgObj.Location;
  }
  // location.awsFileKey = fileName;
  return addCompanyLocation(location);
}

function uploadFile(file, bucketName, fileName) {
  return uploadFilePromise(file, bucketName, fileName).then(data => {
    return data;
  });
}

function uploadFilePromise(file, bucketName, fileName) {
  var uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: "",
    ACL: "public-read"
  };
  var fileStream = fs.createReadStream(file);
  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(file);
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function(err, data) {
      if (err) {
        reject(err);
      }
      if (data) {
        resolve(data);
      } else {
        reject("system error");
      }
    });
  });
}
async function addCompanyLocation(location) {
  location.isHeadOffice = location.isHeadOffice == "false" ? false : true;

  const companyProfile = await userService
    .getCompanyProfileById(location.companyProfileId)
    .catch(err => console.log);

  if (companyProfile) {
    if (location.isHeadOffice) {
      const locations = await locationService.getCompanyLocations(
        companyProfile.id
      );
      locations.map(item => {
        const updateOther = locationService.updateLocation(item, {
          isHeadOffice: 0
        });
      });
    }
    const newLocation = await locationService
      .addLocation(location)
      .catch(err => console.log(err));
    if (newLocation) {
      const newComapanyProfile = await companyProfile.update({
        hasLocations: true
      });
      if (newComapanyProfile) {
        return newLocation;
      }
    }
  }
}

async function getCompanyLocationById(id, userId) {
  const user = await userService.getUserById(userId);
  if (user && user.company_profile) {
    const location = await locationService.getLocationById(id);
    const head = await locationService.getHeadLocationForCompany(
      user.company_profile.id
    );
    if (location.companyProfileId == user.companyProfileId) {
      return { location: location, heads: head };
    }
  }
}

async function getCompanyHeadLocations(userId) {
  const user = await userService.getUserById(userId);
  if (user && user.company_profile && user.companyProfileId) {
    const heads = await locationService.getHeadLocationForCompany(
      user.companyProfileId
    );
    if (heads) {
      return heads;
    }
  }
}

module.exports = {
  getAllCities,
  getAllRegions,
  getAllCountries,
  getRegionCities,
  getCompanyLocations,
  getLocationByCompanyProfile,
  getLocationById,
  updateLocationByAdmin,
  addLocationWithImage,
  getLocation,
  getHeadLocations,
  updateLocation,
  updateLocationPicture,
  getLocatiosForCompany
};
