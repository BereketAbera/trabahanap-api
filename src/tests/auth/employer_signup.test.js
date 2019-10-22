const expect = require('expect');
const request = require('supertest');

const {app} = require('../../server');
const {User} = require('../../models');

var user = {
    email: "bereket5042@gmail.com",
    username: "username",
    password: "password",
    firstName: "firstname",
    lastName: "lastname",
    gender: "MALE",
    role: 'EMPLOYER'
}

beforeEach((done) => {
    User.destroy({where: { email: user.email}}).then(() => done());
})


describe("Post /auth/employer_signup", () => {
    
    it("should create a new employer", (done) => {

        request(app)
            .post('/auth/employer_signup')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(true);
                expect(res.body.employer.email).toBe(user.email);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({where: {email: user.email}})
                    .then(u => {
                        expect(u.dataValues.email).toBe(user.email);
                        done();
                    }).catch(err =>  done(err));
            })
            
    })

    it("should not add employer with non unique email", (done) =>{
        User.create(user).then(u => {
            request(app)
            .post('/auth/employer_signup')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.body.error).toBe('email is not unique');
            })
            .end((err) => done(err));
        })
    })

    it("should not add employer with invalid user detail", (done) => {
        request(app)
            .post('/auth/employer_signup')
            .send({...user, email: 'email'})
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.body.validationError).toBeDefined();
            })
            .end((err) => done(err));
    })
})