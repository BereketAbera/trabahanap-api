const otherService = require('../services/other.service');


function getAllIndustries(req, res, next){
    getIndutries()
        .then(industries => res.status(200).send({success: true, industries}))
        .catch(err => next(err));
}


async function getIndutries(){
    const industries = await otherService.getAllIndustries();
    if(industries){
        return industries;
    }
}


module.exports = {
    getAllIndustries
}