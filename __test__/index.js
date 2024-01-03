const request = require("supertest");
const app = require("../app");
const { sequelize, User, CustomerFavorite } = require("../models/index");
const { queryInterface } = sequelize;
const { payloadToToken } = require("../helpers/tokengen");
const { hashThePassword } = require("../helpers/encryption");

let dataFood = require("../data/foods.json");
dataFood.forEach((e) => {
  delete e.id;
  e.status = "Active";
  e.createdAt = new Date();
  e.updatedAt = new Date();
});
let dataUsers = require("../data/users.json");
dataUsers.forEach((e) => {
  e.password = hashThePassword(e.password);
  e.createdAt = new Date();
  e.updatedAt = new Date();
});
let dataCategories = require("../data/categories.json");
dataCategories.forEach((e) => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});
let access_token, access_token2;

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", dataUsers, {});
  await queryInterface.bulkInsert("Categories", dataCategories, {});
  await queryInterface.bulkInsert("Food", dataFood, {});
  let user = await User.findByPk(2, { raw: true });
  let user2 = await User.findByPk(1, { raw: true });
  delete user.password;
  delete user2.password;
  access_token = payloadToToken(user, "makan ikan");
  access_token2 = payloadToToken(user2, "makan ikan");
  await CustomerFavorite.create({ UserId: user.id, FoodId: 1 });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Costumer sign up testing", () => {
  it("Sending with all correct data", () => {
    const data = {
      username: "aldo marcelino",
      email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual("user created successfully");
        expect(res.body.data).toHaveProperty("id", expect.any(Number));
        expect(res.body.data).toHaveProperty("username", expect.any(String));
        expect(res.body.data).toHaveProperty("email", expect.any(String));
        expect(res.body.data).toHaveProperty("role", "Customer");
        expect(res.body.data).toHaveProperty("phoneNumber", expect.any(String));
        expect(res.body.data).toHaveProperty("address", expect.any(String));
      });
  });
  it("Sending data with no email ", () => {
    const data = {
      username: "aldo marcelino",
      // email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(
          expect.arrayContaining(["email can't null"])
        );
      });
  });

  it("Sending data with no password ", () => {
    const data = {
      username: "aldo marcelino",
      email: "aldo@mail.com",
      // password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["password can't null"]);
      });
  });

  it("Sending data with an empty string email ", () => {
    const data = {
      username: "",
      email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["username is required"]);
      });
  });

  it("Sending data with an empty string password ", () => {
    const data = {
      username: "aldo@mail.com",
      email: "aldo@mail.com",
      password: "",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual([
          "password is required",
          "minimum password is 5",
        ]);
      });
  });

  it("Sending data with an username that alrady created", () => {
    const data = {
      username: "aldo marcelino",
      email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["username must be unique"]);
      });
  });

  it("Sending data with an email that alrady created", () => {
    const data = {
      username: "aldo1@mail.com",
      email: "aldo@mail.com",
      password: "bismillah",
      phoneNumber: "082267580929",
      address: "MEDAN",
      role: "Customer",
    };
    return request(app)
      .post("/cus/signup")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual(["email must be unique"]);
      });
  });
});

describe("Customer login testing", () => {
  it("Sending with all correct data ", () => {
    const data = {
      email: "aldo@mail.com",
      password: "bismillah",
    };
    return request(app)
      .post("/cus/signin")
      .send(data)
      .then((res) => {
        console.log(res.body, "XXXXXXXXxxxxxx");
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toEqual(expect.any(String));
        expect(res.body.user).toHaveProperty("id", expect.any(Number));
        expect(res.body.user).toHaveProperty("username", expect.any(String));
        expect(res.body.user).toHaveProperty("email", expect.any(String));
        expect(res.body.user).toHaveProperty("role", "Customer");
        expect(res.body.user).toHaveProperty("phoneNumber", expect.any(String));
        expect(res.body.user).toHaveProperty("address", expect.any(String));
      });
  });

  it("Sending with wrong password ", () => {
    const data = {
      email: "aldo@mail.com",
      password: "bismillahh",
    };
    return request(app)
      .post("/cus/signin")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toEqual("Invalid Username or Password");
      });
  });

  it("Sending with not registered email ", () => {
    const data = {
      email: "aldomarcelino@mail.com",
      password: "bismillah",
    };
    return request(app)
      .post("/cus/signin")
      .send(data)
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toEqual("Invalid Username or Password");
      });
  });
});

describe("Customer side Food testing", () => {
  it("Access all data from Food without access_token ", () => {
    return request(app)
      .get("/cus/food")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.food[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty("name", expect.any(String));
        expect(res.body.food[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty("status", "Active");
        expect(res.body.food[0]).toHaveProperty("imgUrl", expect.any(String));
        expect(res.body.food[0]).toHaveProperty("authorId", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty(
          "categoryId",
          expect.any(Number)
        );
      });
  });

  it("Access all data from Food without access_token and with one query", () => {
    return request(app)
      .get("/cus/food?price=20000")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.food[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty("name", expect.any(String));
        expect(res.body.food[0].price).toBeGreaterThanOrEqual(20000);
        expect(res.body.food[0]).toHaveProperty("status", "Active");
        expect(res.body.food[0]).toHaveProperty("imgUrl", expect.any(String));
        expect(res.body.food[0]).toHaveProperty("authorId", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty(
          "categoryId",
          expect.any(Number)
        );
      });
  });

  it("Access all data from Food without access_token but with page that give a limt 9", () => {
    return request(app)
      .get("/cus/food?page=1")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.food[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty("name", expect.any(String));
        expect(res.body.food[0]).toHaveProperty("price", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty("status", "Active");
        expect(res.body.food[0]).toHaveProperty("imgUrl", expect.any(String));
        expect(res.body.food[0]).toHaveProperty("authorId", expect.any(Number));
        expect(res.body.food[0]).toHaveProperty(
          "categoryId",
          expect.any(Number)
        );
        expect(res.body.food.length).toBe(9);
      });
  });

  it("Get one data from Food with specific given id ", () => {
    return request(app)
      .get("/cus/food/1")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id", 1);
        expect(res.body).toHaveProperty("name", expect.any(String));
        expect(res.body).toHaveProperty("price", expect.any(Number));
        expect(res.body).toHaveProperty("status", "Active");
        expect(res.body).toHaveProperty("imgUrl", expect.any(String));
        expect(res.body).toHaveProperty("authorId", expect.any(Number));
        expect(res.body).toHaveProperty("categoryId", expect.any(Number));
      });
  });

  it("Fail to Get one data from Food with out of range id  ", () => {
    return request(app)
      .get("/cus/food/100")
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Data Not Found");
      });
  });
});

describe("Customer favorite Food testing ", () => {
  it("Access all favorite food from signin user", () => {
    return request(app)
      .get("/cus/favorite")
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("id", expect.any(Number));
        expect(res.body[0].User).toHaveProperty("id", expect.any(Number));
        expect(res.body[0].Food).toHaveProperty("name", expect.any(String));
      });
  });

  it("Adding favorite food by specific id", () => {
    return request(app)
      .post("/cus/favorite")
      .send({ FoodId: 2 })
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty(
          "message",
          "Added to favorite successfully"
        );
      });
  });

  it("Adding favorite food with out of bound id of food", () => {
    return request(app)
      .post("/cus/favorite")
      .send({ FoodId: Infinity })
      .set("access_token", access_token)
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Data Not Found");
      });
  });

  it("Accessing favorite food of not signin user ", () => {
    return request(app)
      .post("/cus/favorite")
      .send({ FoodId: 1 })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Invalid Token");
      });
  });

  it("Accessing favorite food by user that have a role other than customer ", () => {
    return request(app)
      .get("/cus/favorite")
      .send({ FoodId: 1 })
      .set("access_token", access_token2)
      .then((res) => {
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty("message", "Not Authorize");
      });
  });
});
