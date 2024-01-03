const { Food, Category } = require("../models");

const authzEditFood = async (req, res, next) => {
  try {
    let food = await Food.findByPk(req.params.id);
    if (!food) throw { name: "Not Found" };
    if (req.user.id !== food.authorId && req.user.role !== "Admin")
      throw { name: "Forbidden" };
    next();
  } catch (err) {
    next(err);
  }
};

const authzEditStatusFood = async (req, res, next) => {
  try {
    let food = await Food.findByPk(req.params.id);
    if (!food) throw { name: "Not Found" };
    if (req.user.role !== "Admin") throw { name: "Forbidden" };
    next();
  } catch (err) {
    next(err);
  }
};

const authzCategory = async (req, res, next) => {
  try {
    let category = await Category.findByPk(req.params.id);
    if (!category) throw { name: "Not Found" };
    next();
  } catch (err) {
    next(err);
  }
};

const authzShowFavoriteFood = async (req, res, next) => {
  try {
    if (req.user.role !== "Customer") throw { name: "Forbidden" };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authzEditFood,
  authzCategory,
  authzEditStatusFood,
  authzShowFavoriteFood,
};
