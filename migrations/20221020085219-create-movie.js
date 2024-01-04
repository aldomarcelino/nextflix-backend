"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Movies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      imgUrl: {
        type: Sequelize.TEXT,
      },
      synopsis: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      trailerUrl: {
        type: Sequelize.STRING,
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      poster_path: {
        type: Sequelize.STRING,
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      popularity: {
        type: Sequelize.INTEGER,
      },
      authorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Movies");
  },
};
