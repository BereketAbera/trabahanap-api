// const expect = require('expect');
// const request = require('supertest');

// const {app} = require('../../server');
// const {User} = require('../../models');
// const ROLE = require('./../../_helpers/role');

// var user = {
//     email: "employer@gmail.com",
//     username: "username",
//     phoneNumber: "1234-121-124",
//     password: "password",
//     firstName: "firstname",
//     lastName: "lastname",
//     gender: "MALE",
//     role: ROLE.EMPLOYER
// }

// const employer = {
// 	zipcode: 12422,
//     companyName: "companyname",
// 	contactPerson: "contactperson",
// 	contactNumber: 123412341,
// 	websiteURL: "websiteurl",
// 	industryType: "industrytype",
// 	companyDescription: "companydescription",
// 	businessLicense: 123412341,
// 	companyAddress: "companyaddress",
// 	CityId: 1,
// 	RegionId: 3,
// 	CountryId: 1
// }

// var token = null;


// describe('Post /employer/profile', () => {
//     before((done) => {
//         User.destroy({where: { email: user.email}}).then(x => {
//             User.create(user).then(y => {
//                 request(app)
//                 .post('/auth/login')
//                 .send({email: user.email, password: user.password})
//                 .expect(res => {
//                     token = res.body.user.token;
//                 })
//                 .end(err => done(err));
//             }).catch((err) => done(err))
//         }).catch((err) => done(err));
//     })

//     it('should return invalid token if the token is not valid or tempered with', (done) => {
//         request(app)
//             .post('/employer/profile')
//             .set('Authorization', 'Bearer ' + token  + "random text")
//             .send(employer)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.success).toBe(false);
//                 // expect(res.body.error).toBeDefined();
//             })
//             .end(err => done(err));
//     })

//     it('should add company profile to un existing employer', (done) => {
        
//         request(app)
//             .post('/employer/profile')
//             .set('Authorization', 'Bearer ' + token)
//             .send(employer)
//             .expect(200)
//             .expect((res) => {
//                 console.log(res.body);
//                 expect(res.body.success).toBe(true);
//                 expect(res.body.companyProfile).toBeDefined();
//             })
//             .end(err => done(err));
//     })

//     it('should not add an invalid company profile', (done) => {
//         request(app)
//             .post('/employer/profile')
//             .set('Authorization', 'Bearer ' + token)
//             .send({...employer, companyName: ""})
//             .expect(res => {
//                 expect(res.body.success).toBe(false);
//                 expect(res.body.validationError).toBeDefined();
//             })
//             .end(err => done(err));
//     });
    

// })