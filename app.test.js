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
            .post("/auth/password/reset/123/345")
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
                leader_email: "shahbaz_ali@dev",
                password: "123456789",
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));
    });

    it('POST /auth/login --> should return 401 after login failure', async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                leader_email: "shahbaz_ali@dev",
                password: "1234567sdf89",
            });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            message: expect.any(String),
        });
    })
})

describe("Question Tests ", () => {
    it("GET /question --> should get a list of all the questions.", () => {
        return (request(app)
            .get("/question")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining(
                        expect.objectContaining({
                            name: expect.any(String),
                            description: expect.any(String),
                            test_case: expect.any(String),
                            difficulty: expect.any(String),
                            base_price: expect.any(String),
                            bids: expect.arrayContaining(
                                expect.objectContaining({
                                    team_id: expect.any(String),
                                    bid_price: expect.any(String)
                                })
                            ),
                            status: expect.any(String)
                        })
                    )
                )
            })
        )
    })

    it("GET /question --> should get fetch one question.", () => {
        return (request(app)
            .get("/question/0") // to-do: to replace the id with mongodb id
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.objectContaining({
                        name: expect.any(String),
                        description: expect.any(String),
                        test_case: expect.any(String),
                        difficulty: expect.any(String),
                        base_price: expect.any(String),
                        bids: expect.arrayContaining(
                            expect.objectContaining({
                                team_id: expect.any(String),
                                bid_price: expect.any(String)
                            })
                        ),
                        status: expect.any(String)
                    })
                )
            })
        )
    })

    it('POST /question --> should send validation errors', async() => {
        const res = await request(app).post("/question").send({});
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
    })
})

describe("Auction tests", () => {
    it('GET /question/:id/get_bids --> should get a list of all the bids of a question,',()=>{
        return (request(app)
            .get("/question/0/get_bids") // to-do: to replace the id with mongodb id
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(
                    expect.arrayContaining(
                        expect.objectContaining({
                            team_id: expect.any(String),
                            bid_price: expect.any(String)
                        })
                    )
                )
            })
        )
    })

    it('POST /question/:id/place_bid --> should return validation errors', async()=>{
        const res = await request(app).post("/question/0/place_bid").send({});
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
    })

    it('POST /question/:id/submit --> should return validation errors', async()=>{
        const res = await request(app).post("/question/:id/submit").send({});
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
    })
})
