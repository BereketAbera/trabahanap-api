const { User, ApplicantProfile, CompanyProfile } = require('../models');

function createUser(user){
    return User.create(user).catch(err => console.log(err));
}

function getUserByEmail(email){
    return User.findOne({where: {email}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

function getUserByEmailToken(token){
    return User.findOne({where: {emailVerificationToken: token}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

function getUserById(id){
    return User.findOne({where: { id }, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

function getUserByIdAndRole(id, role){
    return User.findOne({where: { id, role}, include: [{model: CompanyProfile}]}).catch(err => console.log(err));
}

function getAllByCompanyProfileId(companyProfileId){
    return User.findAll({where: {companyProfileId}}).catch(err => console.log(err));
}

function addCompanyProfile(companyprofile){
    return CompanyProfile.create(companyprofile).catch(err => console.log(err));
}

function addApplicantProfile(applicantProfile){
    return ApplicantProfile.create(applicantProfile).catch(err => console.log(err));
}

async function updateUserById(id, newUser){
    let user = await User.findOne({where: { id }}).catch(err => console.log(err));
    return user.update(newUser);
}

async function updateCompanyProfileById(id, companyProfile){
    let compProfile = await CompanyProfile.findOne({where: { id }}).catch(err => console.log(err));
    return compProfile.update(companyProfile)
}

function updateCompanyField(value, fieldName, companyProfileId){
    return CompanyProfile.update({[fieldName]: value},{where: {id: companyProfileId}});
}

function getCompanyProfileById(id){
    return CompanyProfile.findOne({where: {id}}).catch(err => console.log(err));
}

function getAllCompanyProfile(){
    return CompanyProfile.findAll({include: [{model: User}],order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function updateUserField(value, fieldName, userId){
    return User.update({[fieldName]: value},{where: {id: userId}});
}

function getApplicantProfileByUserId(userId){
    return ApplicantProfile.findOne({where: {userId}}).catch(err => console.log(err));
}
function getUserbyCompanyProfileId(id){
    return CompanyProfile.findOne({where:{id}}).catch(err => console.log(err));
}

function getUserAndCompanyProfile(){
    //sequelize.query(`SELECT DISTINCT cp.id, cp.zipcode, cp.companyName, cp.contactPerson, cp.contactNumber,cp.websiteURL,cp.verified, cp.companyLogo,cp.companyDescription,cp.businessLicense,cp.hasLocations, cp.businessLicenseNumber,cp.industryType,cp.companyAddress, u.email,u.username, u.phoneNumber,u.firstName,u.lastName from company_profiles cp INNER JOIN users u ON u.CompanyProfileid = cp.id`,{ type: sequelize.QueryTypes.SELECT});
    return CompanyProfile.findAll( {order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function updateApplicantProfile(applicantProfile, body){
    return applicantProfile.update(body);
}

function getApplicantById(id){
    return ApplicantProfile.findOne({where: {id}, include: [{model: User}]})
}

async function getEmployersWithOffsetAndLimit(offset, limit){
    return await User.findAndCountAll({offset, limit, include: [{model: CompanyProfile}], order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

async function getCompanyWithOffsetAndLimit(offset, limit){
    return await CompanyProfile.findAndCountAll({offset, limit,order: [['createdAt', 'DESC']]}).catch(err => console.log(err));
}

function getAllApplicants(offset,limit){
    return ApplicantProfile.findAndCountAll({offset,limit,include: [{model: User}],order: [['createdAt', 'DESC']]});
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
    updateApplicantProfile,
    getApplicantById,
    getEmployersWithOffsetAndLimit,
    getAllApplicants,
    getAllCompanyProfile,
    getUserbyCompanyProfileId,
    getUserAndCompanyProfile,
    getCompanyWithOffsetAndLimit,
    getAllByCompanyProfileId
};