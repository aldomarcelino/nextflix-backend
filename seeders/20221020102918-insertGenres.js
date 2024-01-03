"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/genre.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Genres", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Genres", null, {});
  },
};
