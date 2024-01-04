const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const { payloadToToken } = require("../helpers/tokengen");
const { hashThePassword } = require("../helpers/encryption");
const generateSlug = require("../helpers/sluggen");

let dataUsers = require("../data/user.json");
let dataMovies = require("../data/mymovies.json");
let dataGenres = require("../data/genre.json");
let access_token;

dataUsers.forEach((e) => {
  e.password = hashThePassword(e.password);
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

dataGenres.forEach((e) => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

dataMovies.forEach((e) => {
  e.slug = generateSlug(e.title);
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

beforeAll(async () => {
  await queryInterface.bulkInsert("Genres", dataGenres, {});
  let user = await User.findByPk(1, { raw: true });
  delete user.password;
  access_token = payloadToToken(user, "makan ikan");
});

describe("Create Genre", () => {
    it("Create genre with correct data", () => {
        const data = {
        name: "AAAA",
        };
        return request(app)
        .post("/genre")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toEqual("genre created successfully");
            expect(res.body.data).toHaveProperty("id", expect.any(Integer));
            expect(res.body.data).toHaveProperty("name", expect.any(String));
        });
    });
    
    it("Create genre with empty name", () => {
        const data = {
        name: "",
        };
        return request(app)
        .post("/genre")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toEqual(["genre is required"]);
        });
    });
});
