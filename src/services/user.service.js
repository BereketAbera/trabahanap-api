const { User, ApplicantProfile, CompanyProfile } = require('../models');

async function createUser(user){
    return await User.create(user).catch(err => console.log(err));
}

async function getUserByEmail(email){
    return await User.findOne({where: {email}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

async function getUserByEmailToken(token){
    return await User.findOne({where: {emailVerificationToken: token}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

async function getUserById(id){
    return await User.findOne({where: { id }, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

async function getUserByIdAndRole(id, role){
    return await User.findOne({where: { id, role}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

async function addCompanyProfile(companyprofile){
    return await CompanyProfile.create(companyprofile).catch(err => console.log(err));
}

async function addApplicantProfile(applicantProfile){
    return await ApplicantProfile.create(applicantProfile).catch(err => console.log(err));
}

async function updateUserById(id, newUser){
    let user = await User.findOne({where: { id }}).catch(err => console.log(err));
    return await user.update(newUser);
}

async function updateCompanyProfileById(id, companyProfile){
    let compProfile = await CompanyProfile.findOne({where: { id }}).catch(err => console.log(err));
    return await compProfile.update(companyProfile)
}

async function updateCompanyField(value, fieldName, companyProfileId){
    return CompanyProfile.update({[fieldName]: value},{where: {id: companyProfileId}});
}

async function getCompanyProfileById(id){
    return await CompanyProfile.findOne({where: {id}}).catch(err => console.log(err));
}

async function updateUserField(value, fieldName, userId){
    return User.update({[fieldName]: value},{where: {id: userId}});
}

async function getApplicantProfileByUserId(userId){
    return await ApplicantProfile.findOne({where: {userId}}).catch(err => console.log(err));
}

function updateApplicantProfile(applicantProfile, body){
    return applicantProfile.update(body);
}


module.exports = {
    updateUserById,
    addApplicantProfile,
    addCompanyProfile,
    getUserByIdAndRole,
    getUserById,
    getUserByEmailToken,
    getUserByEmail,
    createUser,
    updateCompanyProfileById,
    getCompanyProfileById,
    getApplicantProfileByUserId,
    updateCompanyField,
    updateUserField,
    updateApplicantProfile
};