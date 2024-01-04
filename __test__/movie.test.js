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
describe("Create Movie", () => {
  it("Create movie with correct data", () => {
    const data = {
      imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
      synopsis:
      "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
      rating: 100,
      title: "KKN Desa Penari",
      genre: [1, 2, 3],
      cast: ["Nabila"],
    };
    return request(app)
      .post("/movies")
      .send(data)
      .set("access_token", access_token)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id", expect.any(Number));
        expect(res.body).toHaveProperty("imgUrl", data.imgUrl);
        expect(res.body).toHaveProperty("trailerUrl", data.trailerUrl);
        expect(res.body).toHaveProperty("synopsis", data.synopsis);
        expect(res.body).toHaveProperty("rating", data.rating);
        expect(res.body).toHaveProperty("title", data.title);
        expect(res.body).toHaveProperty("genre", data.genre);
        expect(res.body).toHaveProperty("cast", data.cast);
      });
  });
  
  

});

afterAll(async () => {
await queryInterface.bulkDelete("Movies", null, {
  truncate: true,
  cascade: true,
  restartIdentity: true,
});
});