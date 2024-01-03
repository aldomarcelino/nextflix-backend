"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/movieCasts.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("MovieCasts", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MovieCasts", null, {});
  },
};
