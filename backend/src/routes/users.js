const express = require('express');
const { body, query } = require('express-validator');
const { 
  getUsers, 
  getUserById, 
  updateUserStatus, 
  updateUserRole,
  getUserAnalytics,
  deleteUser,
  restoreUser
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// User validation rules
const updateStatusValidation = [
  body('status')
    .isIn(['active', 'inactive', 'suspended', 'banned'])
    .withMessage('Status must be active, inactive, suspended, or banned')
];

const updateRoleValidation = [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be user or admin')
];

// Query validation rules
const queryValidation = [
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
    .isIn(['active', 'inactive', 'suspended', 'banned'])
    .withMessage('Status filter must be active, inactive, suspended, or banned'),
  query('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role filter must be user or admin'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'lastLogin', 'totalSpent', 'engagementScore', 'firstName', 'lastName'])
    .withMessage('Sort by must be createdAt, lastLogin, totalSpent, engagementScore, firstName, or lastName'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// All routes require admin authentication
router.use(authenticate, adminAuth);

// Routes
router.get('/', queryValidation, validateRequest, getUsers);
router.get('/analytics', getUserAnalytics);
router.get('/:id', getUserById);
router.put('/:id/status', updateStatusValidation, validateRequest, updateUserStatus);
router.put('/:id/role', updateRoleValidation, validateRequest, updateUserRole);
router.delete('/:id', deleteUser);
router.patch('/:id/restore', restoreUser);

module.exports = router;
