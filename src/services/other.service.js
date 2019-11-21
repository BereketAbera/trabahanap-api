const {
    Indutry
} = require('../models');

function getAllIndustries(){
    return Indutry.findAll().catch(err => console.log(err));
}

module.exports = {
    getAllIndustries
}