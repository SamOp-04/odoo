const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('company_name').notEmpty().withMessage('Company name is required'),
  body('gstin').notEmpty().withMessage('GSTIN is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('quantity_on_hand').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('rental_pricing.daily').optional().isFloat({ min: 0 }).withMessage('Price must be positive'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateSignup, validateProduct };