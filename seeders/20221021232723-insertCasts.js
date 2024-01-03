"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/casts.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Casts", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Casts", null, {});
  },
};
