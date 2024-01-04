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
  await queryInterface.bulkInsert("Users", dataUsers, {});
  await queryInterface.bulkInsert("Genres", dataGenres, {});
  await queryInterface.bulkInsert("Movies", dataMovies, {});
  let user = await User.findByPk(1, { raw: true });
  delete user.password;
  access_token = payloadToToken(user, "makan ikan");
});
 
describe("Admin sign up testing", () => {
  it("Sending with all correct data", () => {
    const data = {
      username: "aldo marcelino",
      email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Admin",
    };
    return request(app)
      .post("/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual("user created successfully");
        expect(res.body.data).toHaveProperty("id", expect.any(Number));
        expect(res.body.data).toHaveProperty("username", expect.any(String));
        expect(res.body.data).toHaveProperty("email", expect.any(String));
        expect(res.body.data).toHaveProperty("role", "Admin");
        expect(res.body.data).toHaveProperty("phoneNumber", expect.any(String));
        expect(res.body.data).toHaveProperty("address", expect.any(String));
      });
  });

  it("Sending data with no email ", () => {
    const data = {
      username: "muhammadarthur",
      // email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Admin",
    };
    return request(app)
      .post("/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(
          expect.arrayContaining(["email is required"])
        );
      });
  });

  it("Sending data with no password ", () => {
    const data = {
      username: "muhammadarthur",
      email: "aldo@mail.com",
      // password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Admin",
    };
    return request(app)
      .post("/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["password is required"]);
      });
  });

  it("Sending data with an empty string email ", () => {
    const data = {
      username: "arthur@mail.com",
      email: "",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Admin",
    };
    return request(app)
      .post("/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual([
          "email is required",
          "check your format email",
        ]);
      });
  });

  it("Sending data with an empty string password ", () => {
    const data = {
      username: "muhammadarthur",
      email: "aldo@mail.com",
      password: "",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Admin",
    };
    return request(app)
      .post("/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual([
          "password is required",
          "Password minimum 5 charackter",
        ]);
      });
  });

  it("Sending data with an email that alrady created", () => {
    const data = {
      username: "aldo marcelino",
      email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Admin",
    };
    return request(app)
      .post("/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["email must be unique"]);
      });
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});