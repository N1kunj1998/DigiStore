const express = require('express');
const { body, query } = require('express-validator');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts 
} = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Product validation rules
const productValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('type')
    .isIn(['pdf', 'video', 'workbook'])
    .withMessage('Type must be pdf, video, or workbook'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters'),
  body('image')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Image URL is required')
];

// Search validation rules
const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('type')
    .optional()
    .isIn(['pdf', 'video', 'workbook'])
    .withMessage('Type filter must be pdf, video, or workbook'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category filter must be between 1 and 100 characters'),
  query('minPrice')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  query('maxPrice')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['price', 'title', 'createdAt'])
    .withMessage('Sort by must be price, title, or createdAt'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Routes
router.get('/', searchValidation, validateRequest, getProducts);
router.get('/search', searchValidation, validateRequest, searchProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, productValidation, validateRequest, createProduct);
router.put('/:id', authenticate, productValidation, validateRequest, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;

