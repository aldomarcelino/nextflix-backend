"use strict";
const { Model } = require("sequelize");
const generateSlug = require("../helpers/sluggen");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsTo(models.User, {
        foreignKey: "authorId",
      });
      Movie.hasMany(models.GenreMovie);
      Movie.hasMany(models.MovieCast);
    }
  }
  Movie.init(
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "title is required" },
          notNull: { msg: "title is required" },
        },
      },
      imgUrl: DataTypes.TEXT,
      synopsis: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notEmpty: { msg: "synopsis is required" },
          notNull: { msg: "synopsis is required" },
        },
      },
      trailerUrl: DataTypes.STRING,
      slug: DataTypes.STRING,
      rating: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: "rating is required" },
          notNull: { msg: "rating is required" },
          min: {
            args: 1,
            msg: "rating minimum 1",
          },
        },
      },
      popularity: DataTypes.INTEGER,
      poster_path: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  Movie.beforeCreate((movie) => {
    movie.slug = generateSlug(movie.title);
  });
  Movie.beforeUpdate((movie) => {
    movie.slug = generateSlug(movie.title);
  });
  return Movie;
};
