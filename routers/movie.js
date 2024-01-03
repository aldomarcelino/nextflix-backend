const express = require("express");
const MovieController = require("../controllers/movie.controller");
const router = express.Router();

router.get("/", MovieController.showAllMovie);
router.post("/", MovieController.addNewMovies);
router.get("/genre", MovieController.showAllGenre);
router.get("/casts", MovieController.showAllCast);
router.post("/genre", MovieController.addNewGenre);
router.put("/:id", MovieController.updateTheMovie);
router.delete("/:id", MovieController.deleteTheMovie);
router.put("/genre/:id", MovieController.updateTheGenre);
router.delete("/genre/:id", MovieController.deleteTheGenre);
module.exports = router;
