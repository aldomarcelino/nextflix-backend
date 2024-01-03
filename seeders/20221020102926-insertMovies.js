"use strict";

const generateSlug = require("../helpers/sluggen");

module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/mymovies.json");
    data.forEach((el) => {
      el.slug = generateSlug(el.title);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Movies", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Movies", null, {});
  },
};
