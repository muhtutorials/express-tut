const { body } = require('express-validator');

exports.productValidator = () => {
  return [
	  body('title', 'The title must be at least 3 characters long.').isLength({ min: 3 }).trim(),
	  body('imageUrl', 'Please enter a valid URL.').isURL(),
	  body('price', 'The price must be a numeric value.').isNumeric(),
	  body('description', 'Description must be between 8 and 500 characters long.').isLength({ min: 8, max: 500 }).trim()
  ]
}