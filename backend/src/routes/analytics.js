const express = require('express');
const { query } = require('express-validator');
const { 
  getAnalyticsOverview,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics
} = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Analytics validation rules
const analyticsValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('period')
    .optional()
    .isIn(['day', 'week', 'month', 'year'])
    .withMessage('Period must be day, week, month, or year')
];

// All analytics routes require authentication
router.use(authenticate);

// Routes
router.get('/overview', analyticsValidation, validateRequest, getAnalyticsOverview);
router.get('/sales', analyticsValidation, validateRequest, getSalesAnalytics);
router.get('/products', analyticsValidation, validateRequest, getProductAnalytics);
router.get('/users', analyticsValidation, validateRequest, getUserAnalytics);

module.exports = router;

