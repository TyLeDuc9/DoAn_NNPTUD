const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");
const { verifyToken, verifyRole } = require('../middleware/authMiddleware')
router.get("/",  verifyToken, verifyRole(['admin', 'employee']), commentController.getAllComments);
router.post("/", verifyToken, commentController.createComment);
router.get("/book/:bookId", commentController.getCommentsByBook);
router.get("/user/:userId", commentController.getCommentsByUser);
router.delete("/:bookId",  verifyToken, verifyRole(['admin']), commentController.deleteAllCommentsByBook);
router.put("/:commentId", verifyToken, commentController.updateComment);
router.delete("/:commentId", verifyToken, commentController.deleteComment);

module.exports = router;
