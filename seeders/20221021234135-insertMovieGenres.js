"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/movieGenres.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("GenreMovies", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("GenreMovies", null, {});
  },
};
