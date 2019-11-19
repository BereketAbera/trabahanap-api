// const expect = require('expect');
// const request = require('supertest');

// const {app} = require('../../server');
// const {User} = require('../../models');

// var user = {
//     email: "bereket5042@gmail.com",
//     username: "username",
//     phoneNumber: "1234-121-124",
//     password: "password",
//     firstName: "firstname",
//     lastName: "lastname",
//     gender: "MALE",
//     role: 'APPLICANT'
// }

// beforeEach((done) => {
//     User.destroy({where: { email: user.email}}).then(() => done());
// })


// describe("Post /auth/applicant_signup", () => {
    
//     it("should create a new applicant", (done) => {

//         request(app)
//             .post('/auth/applicant_signup')
//             .send(user)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.success).toBe(true);
//                 expect(res.body.applicant.email).toBe(user.email);
//             })
//             .end((err, res) => {
//                 if(err){
//                     return done(err);
//                 }

//                 User.findOne({where: {email: user.email}})
//                     .then(u => {
//                         expect(u.dataValues.email).toBe(user.email);
//                         done();
//                     }).catch(err =>  done(err));
//             })
            
//     })

//     it("should not add applicant with non unique email", (done) =>{
//         User.create(user).then(u => {
//             request(app)
//             .post('/auth/applicant_signup')
//             .send(user)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.success).toBe(false);
//                 expect(res.body.error).toBe('email is not unique');
//             })
//             .end((err) => done(err));
//         })
//     })

//     it("should not add applicant with invalid user detail", (done) => {
//         request(app)
//             .post('/auth/applicant_signup')
//             .send({...user, email: 'email'})
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.success).toBe(false);
//                 expect(res.body.validationError).toBeDefined();
//             })
//             .end((err) => done(err));
//     })
// })