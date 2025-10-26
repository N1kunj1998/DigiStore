const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  createOrder, 
  getOrders, 
  getOrder, 
  processPayment,
  updateOrderStatus 
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Create order validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Product ID must be a valid MongoDB ObjectId'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  body('billingAddress.firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('billingAddress.lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('billingAddress.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('billingAddress.address')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be between 1 and 200 characters'),
  body('billingAddress.city')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters'),
  body('billingAddress.zipCode')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Zip code must be between 1 and 20 characters')
];

// Process payment validation rules
const processPaymentValidation = [
  body('orderId')
    .isMongoId()
    .withMessage('Order ID must be a valid MongoDB ObjectId'),
  body('paymentMethodId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Payment method ID is required')
];

// Update order status validation rules
const updateOrderStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Order ID must be a valid MongoDB ObjectId'),
  body('status')
    .isIn(['pending', 'completed', 'failed', 'cancelled'])
    .withMessage('Status must be pending, completed, failed, or cancelled')
];

// Get orders validation rules
const getOrdersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'cancelled'])
    .withMessage('Status filter must be pending, completed, failed, or cancelled')
];

// Get order validation rules
const getOrderValidation = [
  param('id')
    .isMongoId()
    .withMessage('Order ID must be a valid MongoDB ObjectId')
];

// Routes
router.post('/', authenticate, createOrderValidation, validateRequest, createOrder);
router.get('/', authenticate, getOrdersValidation, validateRequest, getOrders);
router.get('/:id', authenticate, getOrderValidation, validateRequest, getOrder);
router.post('/payment', authenticate, processPaymentValidation, validateRequest, processPayment);
router.put('/:id/status', authenticate, updateOrderStatusValidation, validateRequest, updateOrderStatus);

module.exports = router;

