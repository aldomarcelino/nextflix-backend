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

describe("Create Genre", () => {
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
          // expect(res.body.data).toHaveProperty("id", expect.any(Number));
          // expect(res.body.data).toHaveProperty("name", expect.any(String));
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

afterAll(async () => {
  await queryInterface.bulkDelete("Genres", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
  });
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


describe("Create Movie", () => {
it("Create movie with empty title", () => {
    const data = {
   // title: "",
    synopsis: "AA",
    trailerUrl: "AA",
    rating: 20,
    imgUrl: "AA",
    cast: [{name: "AA", profilePict: "AA"}],
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
    cast: [{name: "AA", profilePict: "AA"}],
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
    cast: [{name: "AA", profilePict: "AA"}],
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
    cast: [{name: "AA", profilePict: "AA"}],
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
    cast: [{name: "AA", profilePict: "AA"}],
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

it("Create movie with empty cast", () => {
    const data = {
    title: "AA",
    synopsis: "AA",
    trailerUrl: "AA",
    rating: 20,
    imgUrl: "AA",
   // cast: [{name: "AA", profilePict: "AA"}],
    genre: ["1"],
    };
    return request(app)
    .post("/movies")
    .set("access_token", access_token)
    .send(data)
    .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["cast is required"]);
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
//   it("Create genre with correct data", () => {
//       const data = {
//       name: "AA",
//       };
//       return request(app)
//       .post("/genre")
//       .set("access_token", access_token)
//       .send(data)
//       .then((res) => {
//           expect(res.statusCode).toBe(201);
//           expect(res.body.message).toEqual("genre created successfully");
//           expect(res.body.data).toHaveProperty("id", expect.any(Number));
//           expect(res.body.data).toHaveProperty("name", expect.any(String));
//       });
//   });
  
//   it("Create genre with empty name", () => {
//       const data = {
//       name: "",
//       };
//       return request(app)
//       .post("/genre")
//       .set("access_token", access_token)
//       .send(data)
//       .then((res) => {
//           expect(res.statusCode).toBe(400);
//           expect(res.body.message).toEqual(["genre is required"]);
//       });
//   });
//   });

// afterAll(async () => {
//   await queryInterface.bulkDelete("Genres", null, {
//       truncate: true,
//       cascade: true,
//       restartIdentity: true,
//   });
// });

// describe("Create Movie", () => {
//   it("Create movie with correct data", () => {
//       const data = {
//       title: "AA",
//       synopsis: "AA",
//       trailerUrl: "AA",
//       rating: 20,
//       imgUrl: "https://youtube.com",
      
//       };
//       return request(app)
//       .post("/movies")
//       .set("access_token", access_token)
//       .send(data)
//       .then((res) => {
//           expect(res.statusCode).toBe(201);
//           expect(res.body.message).toEqual("movie created successfully");
//           expect(res.body.data).toHaveProperty("id", expect.any(Number));
//           expect(res.body.data).toHaveProperty("title", expect.any(String));
//           expect(res.body.data).toHaveProperty("synopsis", expect.any(String));
//           expect(res.body.data).toHaveProperty("trailerUrl", expect.any(String));
//           expect(res.body.data).toHaveProperty("rating", expect.any(Number));
//           expect(res.body.data).toHaveProperty("imgUrl", expect.any(String));
//           expect(res.body.data).toHaveProperty("cast", expect.any(String));
//           expect(res.body.data).toHaveProperty("genre", expect.any(String));
//       });
//   });

  // it("Create movie with correct data", () => {
  //   const data = {
  //     title: "AA",
  //     synopsis: "AA",
  //     trailerUrl: "AA",
  //     rating: 20,
  //     imgUrl: "AA",
  //     cast: [{ name: "AA", profilePict: "AA" }],
  //     genre: ["1"],
  //   };
  //   return request(app)
  //     .post("/movies")
  //     .set("access_token", access_token)
  //     .send(data)
  //     .then((res) => {
  //       expect(res.statusCode).toBe(201);
  //       expect(res.body.message).toEqual("movie created successfully");
  //       expect(res.body.data).toHaveProperty("id", expect.any(Number));
  //       expect(res.body.data).toHaveProperty("title", expect.any(String));
  //       expect(res.body.data).toHaveProperty("synopsis", expect.any(String));
  //       expect(res.body.data).toHaveProperty("trailerUrl", expect.any(String));
  //       expect(res.body.data).toHaveProperty("rating", expect.any(Number));
  //       expect(res.body.data).toHaveProperty("imgUrl", expect.any(String));
  //       expect(res.body.data).toHaveProperty("cast", expect.any(Array));
  //       expect(res.body.data.cast[0]).toHaveProperty("name", expect.any(String));
  //       expect(res.body.data.cast[0]).toHaveProperty("profilePict", expect.any(String));
  //       expect(res.body.data).toHaveProperty("genre", expect.any(Array));
  //     });
  // });
  


// describe("Create Movie", () => {
//   it("Create movie with correct data", () => {
//     const data = {
//       imgUrl: "https://upload.wikimedia.org/wikipedia/id/1/1e/KKN_Desa_Penari_poster.jpg",
//       trailerUrl: "https://www.youtube.com/watch?v=3JqWQkDhJd4",
//       synopsis:
//       "KKN Desa Penari adalah film horor Indonesia tahun 2021 yang disutradarai oleh Awi Suryadi dan dibintangi oleh Prilly Latuconsina, Sandrinna Michelle, dan Endy Arfian. Film ini diadaptasi dari novel berjudul sama karya Risa Saraswati.",
//       rating: 100,
//       title: "KKN Desa Penari",
//       genre: [1, 2, 3],
//       cast: ["Nabila"],
//     };
//     return request(app)
//       .post("/movies")
//       .send(data)
//       .then((res) => {
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty("id", expect.any(Number));
//         expect(res.body).toHaveProperty("imgUrl", data.imgUrl);
//         expect(res.body).toHaveProperty("trailerUrl", data.trailerUrl);
//         expect(res.body).toHaveProperty("synopsis", data.synopsis);
//         expect(res.body).toHaveProperty("rating", data.rating);
//         expect(res.body).toHaveProperty("title", data.title);
//         expect(res.body).toHaveProperty("genre", data.genre);
//         expect(res.body).toHaveProperty("cast", data.cast);
//       });
//   });



  

// });

// afterAll(async () => {
// await queryInterface.bulkDelete("Movies", null, {
//   truncate: true,
//   cascade: true,
//   restartIdentity: true,
// });
// });