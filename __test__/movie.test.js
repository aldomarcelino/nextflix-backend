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
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body.message).toEqual("movie created successfully");
          expect(res.body.data).toHaveProperty("id", expect.any(Number));
          expect(res.body.data).toHaveProperty("title", expect.any(String));
          expect(res.body.data).toHaveProperty("authorId", expect.any(Number));
          expect(res.body.data).toHaveProperty("imgUrl", expect.any(String));
          expect(res.body.data).toHaveProperty("trailerUrl", expect.any(String));
          expect(res.body.data).toHaveProperty("synopsis", expect.any(String));
          expect(res.body.data).toHaveProperty("poster_path", expect.any(String));
          expect(res.body.data).toHaveProperty("popularity", expect.any(Number));
          expect(res.body.data).toHaveProperty("rating", expect.any(Number));
        
        });
    });
  
    it("Create movie with empty title", () => {
      const data = {
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: 100,
        title: "",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["title is required"]);
        });
    }
    );
  
    it("Create movie with empty synopsis", () => {
      const data = {
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis: "",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["synopsis is required"]);
        });
    }
    );
  
    it("Create movie with empty trailerUrl", () => {
      const data = {
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        //trailerUrl: "",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["trailerUrl is required"]);
        });
    }
    );
  
    it("Create movie with empty imgUrl", () => {
      const data = {
        authorId: 1,
        //imgUrl: "",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["imgUrl is required"]);
        });
    }
    );
  
    it("Create movie with empty poster_path", () => {
      const data = {
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        //poster_path: "",
        popularity: 100,
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["poster_path is required"]);
        });
    }
    );
  
    it("Create movie with empty popularity", () => {
      const data = {
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        //popularity: "",
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["popularity is required"]);
        });
    }
    );
  
    it("Create movie with empty rating", () => {
      const data = {
        authorId: 1,
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: "",
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["rating is required"]);
        });
    }
    );
    
    it("Create movie with empty authorId", () => {
      const data = {
        authorId: "",
        imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
        "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
        poster_path:
        "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        popularity: 100,
        rating: 100,
        title: "KKN Desa Penari",
        slug: "kkn-desa-penari",
      };
      return request(app)
        .post("/movies")
        .set("access_token", access_token)
        .send(data)
        .then((res) => {
          console.log(res.body)
          expect(res.statusCode).toBe(400);
          expect(res.body.message).toEqual(["authorId is required"]);
        });
    }
    );
  
  });

afterAll(async () => {
  await queryInterface.bulkDelete("Movies", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

