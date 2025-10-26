const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  createLead, 
  getLeads, 
  getLead, 
  updateLeadStatus,
  getLeadStats 
} = require('../controllers/leadController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Create lead validation rules
const createLeadValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Phone number must be between 1 and 20 characters'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('source')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Source must be between 1 and 100 characters'),
  body('productId')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product ID must be between 1 and 100 characters'),
  body('productTitle')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product title must be between 1 and 200 characters')
];

// Update lead status validation rules
const updateLeadStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Lead ID must be a valid MongoDB ObjectId'),
  body('status')
    .isIn(['new', 'contacted', 'nurturing', 'converted'])
    .withMessage('Status must be new, contacted, nurturing, or converted'),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Notes must be between 1 and 500 characters')
];

// Get leads validation rules
const getLeadsValidation = [
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
    .isIn(['new', 'contacted', 'nurturing', 'converted'])
    .withMessage('Status filter must be new, contacted, nurturing, or converted'),
  query('source')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Source filter must be between 1 and 100 characters')
];

// Get lead validation rules
const getLeadValidation = [
  param('id')
    .isMongoId()
    .withMessage('Lead ID must be a valid MongoDB ObjectId')
];

// Routes
router.post('/', createLeadValidation, validateRequest, createLead);
router.get('/stats', authenticate, getLeadStats);
router.get('/', authenticate, getLeadsValidation, validateRequest, getLeads);
router.get('/:id', authenticate, getLeadValidation, validateRequest, getLead);
router.put('/:id/status', authenticate, updateLeadStatusValidation, validateRequest, updateLeadStatus);

module.exports = router;

