const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    uploadImages 
} = require('../controllers/productController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Validation rules
const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').optional().isString(),
    body('sizes').optional().isArray(),
    body('images').optional().isArray()
];

// Public routes
router.get('/', getProducts);
router.get('/:identifier', getProduct);

// Admin routes
router.post('/', 
    authenticateToken, 
    authorizeAdmin, 
    productValidation, 
    createProduct
);

router.put('/:id', 
    authenticateToken, 
    authorizeAdmin, 
    productValidation, 
    updateProduct
);

router.delete('/:id', 
    authenticateToken, 
    authorizeAdmin, 
    deleteProduct
);

router.post('/:id/images', 
    authenticateToken, 
    authorizeAdmin, 
    upload.array('images', 5), 
    uploadImages
);

module.exports = router;