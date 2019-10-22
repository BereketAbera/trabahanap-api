const {
    Location,
    CompanyProfile
} = require('../models');

async function getLocationById(LocationId){
    const location = Location.findOne({where: {id: LocationId}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
    if(location){
        return location;
    }
}

async function createLocation(location){
    const loc = Location.create(location).catch(err => console.log(err));
    if(loc){
        return loc;
    }
}

module.exports = {
    getLocationById,
    createLocation
}