const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

router.put('/change-password', verifyToken, userController.changePassword);

router.get('/all', verifyToken, verifyRole(['admin', 'employee']), userController.getAllUsers);
router.get('/:id', verifyToken, verifyRole(['admin', 'employee']), userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, verifyRole(['admin']), userController.deleteUser);

module.exports = router;
