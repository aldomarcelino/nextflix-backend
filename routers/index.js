const express = require("express");
const Controller = require("../controllers/user.controller");
const authentication = require("../middleware/auth");
const router = express.Router();
const routerMovies = require("./movie");
const errorHandler = require("../middleware/errhandler");
const MovieController = require("../controllers/movie.controller");

router.post("/signin", Controller.signIn);
router.post("/signup", Controller.signUp);
router.get("/public", MovieController.showAllMovieFree);
router.use(authentication);
router.use("/movies", routerMovies);
router.use(errorHandler);
module.exports = router;
