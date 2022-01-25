const { body } = require('express-validator');

const User = require('../models/user');

exports.signupValidator = () => {
	return [
	  body('email')
	    .isEmail()
	    .withMessage('Please enter a valid email.')
	    .normalizeEmail()
	    .custom(value => {
	      return User.findOne({ email: value })
	        .then(user => {
	          if (user) {
	            return Promise.reject('Email already exists, pick a different one.');
	          }
	        })
	    }),

	  body('password', 'The password must be 6+ characters long and contain a number.')
	    .isLength({ min: 6 })
	    .matches(/\d/)
	    // remove whitespace
	    .trim(),

	  body('confirmPassword')
	    .trim()
	    .custom((value, { req }) => {
	      if (value !== req.body.password) {
	        throw new Error('Password confirmation does not match password.');
	      }
	      // Indicates the success of this synchronous custom validator
	      return true;
	    })
	]
}
