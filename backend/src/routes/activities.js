const express = require('express');
const { body, query } = require('express-validator');
const { 
  trackActivity,
  getUserActivityAnalytics,
  getConversionFunnel,
  getUserJourney,
  getRealTimeActivity,
  getEngagementMetrics
} = require('../controllers/activityController');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Activity tracking validation
const trackActivityValidation = [
  body('userId')
    .isMongoId()
    .withMessage('Valid userId is required'),
  body('sessionId')
    .notEmpty()
    .withMessage('sessionId is required'),
  body('activityType')
    .isIn([
      'page_view', 'product_view', 'category_view',
      'add_to_cart', 'remove_from_cart', 'update_cart', 'view_cart',
      'checkout_start', 'checkout_step', 'payment_attempt', 'payment_success', 'payment_failed',
      'login', 'logout', 'register', 'profile_update', 'password_change',
      'search', 'filter', 'sort', 'download', 'share', 'bookmark',
      'lead_magnet_view', 'lead_magnet_download', 'newsletter_signup',
      'contact_form', 'faq_view', 'support_ticket',
      'session_start', 'session_end', 'bounce', 'return_visit'
    ])
    .withMessage('Valid activityType is required'),
  body('conversionValue')
    .optional()
    .isNumeric()
    .withMessage('conversionValue must be a number'),
  body('funnelStage')
    .optional()
    .isIn(['awareness', 'interest', 'consideration', 'intent', 'purchase', 'retention'])
    .withMessage('Valid funnelStage is required')
];

// Query validation
const queryValidation = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Days must be between 1 and 365'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000'),
  query('userId')
    .optional()
    .isMongoId()
    .withMessage('Valid userId is required'),
  query('sessionId')
    .optional()
    .notEmpty()
    .withMessage('sessionId is required')
];

// Public route for tracking (no auth required for basic tracking)
router.post('/track', trackActivityValidation, validateRequest, trackActivity);

// Admin routes (require authentication and admin privileges)
router.use(authenticate, adminAuth);

router.get('/analytics', queryValidation, validateRequest, getUserActivityAnalytics);
router.get('/funnel', queryValidation, validateRequest, getConversionFunnel);
router.get('/journey', queryValidation, validateRequest, getUserJourney);
router.get('/realtime', queryValidation, validateRequest, getRealTimeActivity);
router.get('/engagement', queryValidation, validateRequest, getEngagementMetrics);

module.exports = router;
