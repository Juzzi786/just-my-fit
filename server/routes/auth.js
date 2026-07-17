const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
    login, 
    verifyToken, 
    changePassword,
    forgotPassword,
    resetPassword 
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Validation rules
const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const passwordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Public routes
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/verify', authenticateToken, verifyToken);
router.post('/change-password', authenticateToken, passwordValidation, changePassword);

module.exports = router;