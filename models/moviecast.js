"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovieCast extends Model {
    static associate(models) {
      MovieCast.belongsTo(models.Movie);
      MovieCast.belongsTo(models.Cast, { foreignKey: "CastsId" });
    }
  }
  MovieCast.init(
    {
      MovieId: DataTypes.INTEGER,
      CastsId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MovieCast",
    }
  );
  return MovieCast;
};
