const expect = require('expect');
const request = require('supertest');

const {app} = require('../../server');
const {User} = require('../../models');

var user = {
    email: "bereket5042@gmail.com",
    username: "username",
    phoneNumber: "1234-121-124",
    password: "password",
    firstName: "firstname",
    lastName: "lastname",
    gender: "MALE",
    role: 'EMPLOYER'
}


beforeEach((done) => {
    User.destroy({where: { email: user.email}}).then(() => done());
});

describe("Post /auth/login", () => {

    it("should authenticate users with email and password", (done) => {
        User.create(user).then(() => {
            request(app)
                .post('/auth/login')
                .send({email: user.email, password: user.password})
                .expect(200)
                .expect((res) => {
                    expect(res.body.success).toBe(true);
                    expect(res.body.user.token).toBeDefined();
                })
                .end(err => done(err));
        });
    })

    it("sbould not authenticate users with wrong email or password", (done) => {
        request(app)
            .post('/auth/login')
            .send({email: 'do not exist', password: 'wrong password'})
            .expect(200)
            .expect((res) => {
                expect(res.body.success).toBe(false);
                expect(res.body.error).toBeDefined();
            })
            .end(err => done(err));
    })
})
