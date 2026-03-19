const express = require("express");
const router = express.Router();
const ratingController = require("../controller/ratingController");

router.post("/", ratingController.createRating);
router.get("/check", ratingController.checkUserRated);
router.get("/summary", ratingController.getAllBooksWithRatings);
router.get("/book/:bookId", ratingController.getRatingsByBook);

router.get("/user/:userId", ratingController.getRatingsByUser);

router.put("/:id", ratingController.updateRating);
router.delete("/:bookId", ratingController.deleteAllRatingsByBook);

router.delete("/:id", ratingController.deleteRating);

module.exports = router;
