"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cast extends Model {
    static associate(models) {
      Cast.hasMany(models.MovieCast, { foreignKey: "CastsId" });
    }
  }
  Cast.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          notNull: true,
        },
      },
      profilePict: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Cast",
    }
  );
  return Cast;
};
