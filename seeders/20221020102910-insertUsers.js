"use strict";
const { hashThePassword } = require("../helpers/encryption");

module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require("../data/user.json");
    data.forEach((el) => {
      el.password = hashThePassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
