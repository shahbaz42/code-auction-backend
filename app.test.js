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

    it("POST /auth/register --> should successfully register a user into database.", async () => {});

    it('POST /auth/login --> should return token after login success', () => {
        return ( request(app)
            .post("/auth/login")
            .send({
                email : "shahbaz_ali@dev",
                password : "123456789"
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        role : expect.any(String),
                        token : expect.any(String)
                    })
                )
            })
        )
    })

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