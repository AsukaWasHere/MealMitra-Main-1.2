import { body, validationResult } from 'express-validator';

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input',
      errors: errors.array().map(err => err.msg),
    });
  }
  next();
};

// --- Define Validation Rules ---

export const signupValidationRules = () => [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('role', 'Role must be either donor or receiver').isIn(['donor', 'receiver']),
];

export const loginValidationRules = () => [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
];

export const listingValidationRules = () => [
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('quantity', 'Quantity must be a positive number').isInt({ gt: 0 }),
  body('location', 'Location is required').not().isEmpty(),
];

export { validate };