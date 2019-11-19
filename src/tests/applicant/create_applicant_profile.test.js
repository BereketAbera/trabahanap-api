// const expect = require('expect');
// const request = require('supertest');

// const {app} = require('../../server');
// const {User} = require('../../models');
// const ROLE = require('./../../_helpers/role');

// var user = {
//     email: "applicant@gmail.com",
//     username: "username",
//     phoneNumber: "1234-121-124",
//     password: "password",
//     firstName: "firstname",
//     lastName: "lastname",
//     gender: "MALE",
//     role: ROLE.APPLICANT
// }

// var applicant = {
// 	currentEmployer: "currentemployer",
// 	currentOccopation: "currentoccopation",
// 	address1: "address1",
// 	address2: "address2",
// 	selfDescription: "selfdescription",
// 	CityId: 1,
// 	RegionId: 3,
// 	CountryId: 1
// }

// var token = null;


// describe('Post /applicant/profile', () => {
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
//             .post('/applicant/profile')
//             .set('Authorization', 'Bearer ' + token  + "random text")
//             .send(applicant)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.success).toBe(false);
//                 // expect(res.body.error).toBeDefined();
//             })
//             .end(err => done(err));
//     })

//     it('should add profile to un existing applicant', (done) => {
        
//         request(app)
//             .post('/applicant/profile')
//             .set('Authorization', 'Bearer ' + token)
//             .send(applicant)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.success).toBe(true);
//                 expect(res.body.applicantProfile).toBeDefined();
//             })
//             .end(err => done(err));
//     })

//     it('should not add an invalid applicant profile', (done) => {
//         request(app)
//             .post('/applicant/profile')
//             .set('Authorization', 'Bearer ' + token)
//             .send({...applicant, currentEmployer: ""})
//             .expect(res => {
//                 expect(res.body.success).toBe(false);
//                 expect(res.body.validationError).toBeDefined();
//             })
//             .end(err => done(err));
//     });
    

// })