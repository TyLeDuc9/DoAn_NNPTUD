const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
// EMAIL/PASSWORD
router.post('/register-email', authController.registerByEmail);
router.post('/register-employee', verifyToken, verifyRole(['admin']), authController.registerEmployeeEmail);
router.post('/login-email', authController.loginByEmail);
router.post("/login-google", authController.loginWithGoogle);

module.exports = router;
