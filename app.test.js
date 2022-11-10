const request = require("supertest");
// const User = require("../models/user");
const app = require("./app")

describe("Server Status", () => {
    it("should return 200", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
    });
});

describe("Authentication Tests", () => {

    it("POST /auth/register --> should send validation errors", async () => {
        const res = await request(app)
        .post("/auth/register")
        .send({});

        expect(res.status).toBe(422);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: expect.any(String),
                    param: expect.any(String),
                    location: expect.any(String),
                }),
            ])
        );
    });

    it("POST /auth/login --> should send validation errors", async () => {
        const res = await request(app)
        .post("/auth/login")
        .send({});
        expect(res.status).toBe(422);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: expect.any(String),
                    param: expect.any(String),
                    location: expect.any(String),
                }),
            ])
        );
    });

    it("POST /auth/password/reset --> should send validation errors", async () => {
        const res = await request(app)
        .post("/auth/password/reset")
        .send({});
        expect(res.status).toBe(422);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: expect.any(String),
                    param: expect.any(String),
                    location: expect.any(String),
                }),
            ])
        );
    });

    it("POST /auth/password/reset/:token --> should send validation errors", async () => {
        const res = await request(app)
        .post("/auth/password/reset/123")
        .send({});
        expect(res.status).toBe(422);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: expect.any(String),
                    param: expect.any(String),
                    location: expect.any(String),
                }),
            ])
        );
    });

    it('POST /auth/login --> should return token after login success', async () => {
        const res = await request(app)
        .post("/auth/login")
        .send({
            leader_email: "shahbaz_ali@test.com",
            password: "123456789",
        });

        expect(res.status).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));
    });

    it('POST /auth/login --> should return 401 after login failure', () => {
        return ( request(app)
            .post("/auth/login")
            .send({
                email : "shahbaz_ali@dev",
                password : "wrong_password"
            })
            .expect('Content-Type', /json/)
            .expect(401)
            .then(response => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        message : expect.any(String)
                    })
                )
            })
        )
    })
})