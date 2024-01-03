const {
  Genre,
  Cast,
  MovieCast,
  Movie,
  sequelize,
  GenreMovie,
  User,
} = require("../models");
const axios = require("axios");

class MovieController {
  static async showAllMovieFree(req, res, next) {
    try {
      let data = await Movie.findAll({
        include: [
          { model: MovieCast, include: Cast },
          { model: GenreMovie, include: Genre },
          { model: User, attributes: ["email"] },
        ],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  static async showAllMovie(req, res, next) {
    try {
      let data = await Movie.findAll({
        include: [
          { model: MovieCast, include: Cast },
          { model: GenreMovie, include: Genre },
          { model: User, attributes: ["email"] },
        ],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async showAllGenre(req, res, next) {
    try {
      let data = await Genre.findAll();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async showAllCast(req, res, next) {
    try {
      let { data } = await axios.get(
        `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
      );
      data = data?.results?.map((el) => ({
        name: el.name,
        profilePict: el.profile_path,
      }));
    } catch (err) {
      next(err);
    }
  }

  static async addNewMovies(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, synopsis, trailerUrl, rating, imgUrl, cast, genre } =
        req.body;
      const movie = await Movie.create(
        {
          title,
          trailerUrl,
          synopsis,
          popularity: 0,
          rating,
          authorId: req.user.id,
          imgUrl,
        },
        { transaction: t }
      );
      const genres = genre.map((el) => ({ MovieId: movie.id, GenreId: el }));
      let actors = await Cast.bulkCreate(cast, { transaction: t });
      const casts = await actors.map((el) => ({
        MovieId: movie.id,
        CastsId: el.id,
      }));
      await GenreMovie.bulkCreate(genres, { transaction: t });
      await MovieCast.bulkCreate(casts, { transaction: t });
      await t.commit();
      res.status(201).json({ message: "Movie added successfully" });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }
  static async updateTheMovie(req, res, next) {
    console.log(req.body, "<<<<<");
    const t = await sequelize.transaction();
    try {
      const { title, synopsis, trailerUrl, rating, imgUrl, cast, genre } =
        req.body;
      const theMovie = await Movie.findByPk(req.params.id);
      if (!theMovie) throw { name: "Not_Found" };
      await Movie.update(
        {
          title,
          trailerUrl,
          synopsis,
          popularity: 0,
          rating,
          authorId: req.user.id,
          imgUrl,
        },
        { transaction: t, where: { id: req.params.id }, individualHooks: true }
      );
      await GenreMovie.destroy({
        where: { MovieId: theMovie.id },
        transaction: t,
      });
      await MovieCast.destroy({
        where: { MovieId: theMovie.id },
        transaction: t,
      });
      const genres =await genre.map((el) => ({
        MovieId: theMovie.id,
        GenreId: +el,
      }));
      let actors = await Cast.bulkCreate(cast, {
        updateOnDuplicate: ["id"],
        transaction: t,
      });
      const casts = await actors.map((el) => ({
        MovieId: theMovie.id,
        CastsId: el.id,
      }));
      await GenreMovie.bulkCreate(genres, { transaction: t });
      await MovieCast.bulkCreate(casts, { transaction: t });
      await t.commit();
      res.status(201).json({ message: "Movie update successfully" });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  static async addNewGenre(req, res, next) {
    try {
      const { name } = req.body;
      await Genre.create({ name });
      res.status(201).json({ message: "genre created successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateTheGenre(req, res, next) {
    try {
      const { name } = req.body;
      await Genre.update({ name }, { where: { id: req.params.id } });
      res.status(201).json({ message: "genre updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTheMovie(req, res, next) {
    try {
      let data = await Movie.findByPk(req.params.id);
      if (!data) throw { name: "Not Found" };
      await Movie.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: ` ${data.title} success to delete` });
    } catch (err) {
      next(err);
    }
  }

  static async deleteTheGenre(req, res, next) {
    try {
      let data = await Genre.findByPk(req.params.id);
      if (!data) throw { name: "Not Found" };
      await Genre.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: ` ${data.name} success to delete` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MovieController;
