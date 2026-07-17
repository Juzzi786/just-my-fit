const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
    createOrder, 
    getOrders, 
    getOrder, 
    updateOrderStatus, 
    deleteOrder,
    getOrderStats 
} = require('../controllers/orderController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Validation rules for order creation
const orderValidation = [
    body('customer_name').notEmpty().withMessage('Name is required'),
    body('customer_email').isEmail().withMessage('Valid email is required'),
    body('customer_phone').notEmpty().withMessage('Phone number is required'),
    body('shipping_address').notEmpty().withMessage('Shipping address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('pincode').notEmpty().withMessage('Pincode is required'),
    body('order_items').isArray({ min: 1 }).withMessage('At least one item is required')
];

// Public routes
router.post('/', orderValidation, createOrder);
router.get('/track/:id', getOrder);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getOrders);
router.get('/stats/overview', authenticateToken, authorizeAdmin, getOrderStats);
router.get('/:id', authenticateToken, authorizeAdmin, getOrder);
router.patch('/:id/status', authenticateToken, authorizeAdmin, updateOrderStatus);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteOrder);

module.exports = router;