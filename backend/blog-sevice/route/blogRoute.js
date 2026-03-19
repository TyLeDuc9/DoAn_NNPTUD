const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const uploadBlogImages = require('../middleware/uploadBlog');

router.post("/", verifyToken, verifyRole(['admin', 'employee']), uploadBlogImages, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", verifyToken, verifyRole(['admin', 'employee']), uploadBlogImages, blogController.updateBlog);
router.delete("/:id", verifyToken, verifyRole(['admin', 'employee']), blogController.deleteBlog);

module.exports = router;
