const express = require('express')
const router = express.Router()
const uploadBookImage = require('../middlewares/uploadBook');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const bookController = require('../controller/bookController');
router.get("/", bookController.getBooks);
router.get("/all", bookController.getAllBooks);
router.post('/',verifyToken,verifyRole(['admin', 'employee']), bookController.createBook)
router.get('/latest', bookController.getLatestBooks);
router.get('/:id/:slug', bookController.getBookByIdAndSlug)
router.get('/:id', bookController.getBookById)
router.put('/:id',verifyToken,verifyRole(['admin', 'employee']), bookController.updateBook)
router.delete('/:id',verifyToken,verifyRole(['admin']), bookController.deleteBook);
module.exports = router;