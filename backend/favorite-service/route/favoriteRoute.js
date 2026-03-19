const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const favoriteController = require('../controller/favoriteController');

router.get("/all", verifyToken, verifyRole(['admin','employee']), favoriteController.getAllFavorites);
router.get('/check', favoriteController.isFavorite);
router.get('/:userId', favoriteController.getFavoritesByUser);
router.post('/', favoriteController.addFavorite);
router.delete('/:bookDetailId', favoriteController.deleteAllFavoritesByBookDetail);
router.delete('/', favoriteController.removeFavorite);

module.exports = router;
