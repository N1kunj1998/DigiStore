const express = require('express');
const { body, param } = require('express-validator');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Add to cart validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ObjectId'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
];

// Update cart item validation rules
const updateCartItemValidation = [
  param('itemId')
    .isMongoId()
    .withMessage('Item ID must be a valid MongoDB ObjectId'),
  body('quantity')
    .isInt({ min: 0, max: 10 })
    .withMessage('Quantity must be between 0 and 10')
];

// Remove from cart validation rules
const removeFromCartValidation = [
  param('itemId')
    .isMongoId()
    .withMessage('Item ID must be a valid MongoDB ObjectId')
];

// All cart routes require authentication
router.use(authenticate);

// Routes
router.get('/', getCart);
router.post('/add', addToCartValidation, validateRequest, addToCart);
router.put('/:itemId', updateCartItemValidation, validateRequest, updateCartItem);
router.delete('/:itemId', removeFromCartValidation, validateRequest, removeFromCart);
router.delete('/', clearCart);

module.exports = router;

