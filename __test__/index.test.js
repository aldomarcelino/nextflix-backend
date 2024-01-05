const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;
const { payloadToToken, tokenToPayload } = require("../helpers/tokengen");
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
  access_token = payloadToToken({ id: user.id, email: user.email });
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

describe("Genre Creation Testing", () => {
  it("Create genre with correct data", () => {
    const data = {
      name: "AA",
    };
    return request(app)
      .post("/movies/genre")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual("genre created successfully");
      });
  });

  it("Create genre with empty name", () => {
    const data = {
      name: "",
    };
    return request(app)
      .post("/movies/genre")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["genre is required"]);
      });
  });
});

describe("Create Movie Testing", () => {
  it("Create movie with correct data", () => {
    return request(app)
      .post("/movies")
      .send({
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
          "Tenggelamnya Kapal Van der Wijck (judul internasional The Sinking of the van der Wijck) adalah film drama romantis Indonesia tahun 2013 yang disutradarai oleh Sunil Soraya dan diproduseri oleh Ram Soraya.",
        rating: "80",
        title: "Tenggelamnya Kapal Van der Wijck",
        genre: ["1", "2", "3"],
        cast: [
          {
            name: "Nabila",
            profilePict:
              "https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2022/09/18/1973948211.jpg",
          },
        ],
      })
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Movie added successfully");
      });
  });

  it("Create movie with empty title", () => {
    const data = {
      // title: "",
      synopsis: "AA",
      trailerUrl: "AA",
      rating: 20,
      imgUrl: "AA",
      cast: [{ name: "AA", profilePict: "AA" }],
      genre: ["1"],
    };
    return request(app)
      .post("/movies")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["title is required"]);
      });
  });

  it("Create movie with empty synopsis", () => {
    const data = {
      title: "AA",
      // synopsis: "AA",
      trailerUrl: "AA",
      rating: 20,
      imgUrl: "AA",
      cast: [{ name: "AA", profilePict: "AA" }],
      genre: ["1"],
    };
    return request(app)
      .post("/movies")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["synopsis is required"]);
      });
  });

  it("Create movie with empty trailerUrl", () => {
    const data = {
      title: "AA",
      synopsis: "AA",
      // trailerUrl: "AA",
      rating: 20,
      imgUrl: "AA",
      cast: [{ name: "AA", profilePict: "AA" }],
      genre: ["1"],
    };
    return request(app)
      .post("/movies")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["trailerUrl is required"]);
      });
  });

  it("Create movie with empty rating", () => {
    const data = {
      title: "AA",
      synopsis: "AA",
      trailerUrl: "AA",
      // rating: 20,
      imgUrl: "AA",
      cast: [{ name: "AA", profilePict: "AA" }],
      genre: ["1"],
    };
    return request(app)
      .post("/movies")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["rating is required"]);
      });
  });

  it("Create movie with empty imgUrl", () => {
    const data = {
      title: "AA",
      synopsis: "AA",
      trailerUrl: "AA",
      rating: 20,
      // imgUrl: "AA",
      cast: [{ name: "AA", profilePict: "AA" }],
      genre: ["1"],
    };
    return request(app)
      .post("/movies")
      .set("access_token", access_token)
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["imgUrl is required"]);
      });
  });
});

describe("Movie Edit Testing", () => {
  it("Edit movie with correct data", () => {
    return request(app)
      .put("/movies/1")
      .send({
        imgUrl:
          "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
        trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
        synopsis:
          "Tenggelamnya Kapal Van der Wijck (judul internasional The Sinking of the van der Wijck) adalah film drama romantis Indonesia tahun 2013 yang disutradarai oleh Sunil Soraya dan diproduseri oleh Ram Soraya.",
        rating: "80",
        title: "Tenggelamnya Kapal Van der Wijck",
        genre: ["1", "2", "3"],
        cast: [
          {
            name: "Nabila",
            profilePict:
              "https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2022/09/18/1973948211.jpg",
          },
        ],
      })
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Movie update successfully");
      });
  });
});

describe("Genre Edit Testing", () => {
  it("Edit genre with correct data", () => {
    return request(app)
      .put("/movies/genre/1")
      .send({ name: "Action bro" })
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("genre updated successfully");
      });
  });
});

describe("Get Movie and Genre List", () => {
  it("Access all data movies without access_token ", () => {
    return request(app)
      .get("/public")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body[0]).toHaveProperty("title", expect.any(String));
        expect(res.body[0]).toHaveProperty("imgUrl", expect.any(String));
        expect(res.body[0]).toHaveProperty("synopsis", expect.any(String));
        expect(res.body[0]).toHaveProperty("trailerUrl", expect.any(String));
        expect(res.body[0]).toHaveProperty("slug", expect.any(String));
        expect(res.body[0]).toHaveProperty("rating", expect.any(Number));
      });
  });

  it("Access all data movies with access_token ", () => {
    return request(app)
      .get("/movies")
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body[0]).toHaveProperty("title", expect.any(String));
        expect(res.body[0]).toHaveProperty("imgUrl", expect.any(String));
        expect(res.body[0]).toHaveProperty("synopsis", expect.any(String));
        expect(res.body[0]).toHaveProperty("trailerUrl", expect.any(String));
        expect(res.body[0]).toHaveProperty("slug", expect.any(String));
        expect(res.body[0]).toHaveProperty("rating", expect.any(Number));
      });
  });

  it("Access all data Genre with access_token ", () => {
    return request(app)
      .get("/movies/genre")
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body[0]).toHaveProperty("name", expect.any(String));
        expect(res.body[0]).toHaveProperty("createdAt", expect.any(String));
        expect(res.body[0]).toHaveProperty("updatedAt", expect.any(String));
      });
  });
});

describe("Generate Slag Title Function Test", () => {
  it("should generate a slug from a title", () => {
    const title = "Hello World";
    const expectedSlug = "Hello-World";

    const result = generateSlug(title);

    expect(result).toBe(expectedSlug);
  });

  it("should handle titles with multiple spaces", () => {
    const title = "Multiple  Spaces  Here ";
    const expectedSlug = "Multiple--Spaces--Here-";

    const result = generateSlug(title);

    expect(result).toBe(expectedSlug);
  });

  it("should handle titles with special characters", () => {
    const title = "!@#$%^&*()_+";
    const expectedSlug = "!@#$%^&*()_+";

    const result = generateSlug(title);

    expect(result).toBe(expectedSlug);
  });
});

describe("Jsonwebtoken Function Testing", () => {
  it("should generate access token correctly", () => {
    const accessToken = payloadToToken({ id: 1, email: "Asep Bareto" });
    expect(accessToken).toStrictEqual(expect.any(String));
  });

  it("should generate payload correctly from access token", () => {
    const accessToken = payloadToToken({ id: 1, email: "Asep Bareto" });
    const payload = tokenToPayload(accessToken);

    expect(accessToken).toStrictEqual(expect.any(String));
    expect(payload).toHaveProperty("id", 1);
    expect(payload).toHaveProperty("email", "Asep Bareto");
  });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
