const request = require("supertest");
const app = require("./app")

describe("Authentication Tests", () => {
    it('POST /auth/login --> should return token after login success', () => {
        return ( request(app)
            .post("/auth/login")
            .send({
                email : "shahbaz_ali@outlook.in",
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
})





