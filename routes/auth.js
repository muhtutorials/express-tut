const express = require('express');
const { body } = require('express-validator');

const {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword
} = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post(
  '/signup',
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail()
    .custom(value => {
      console.log(value)
      return User.findOne({ email: value })
        .then(user => {
          if (user) {
            return Promise.reject('Email already exists, pick a different one.');
          }
        })
    }),
  body('password', 'The password must be 6+ chars long and contain a number.')
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
    }),
  postSignup
);

router.post('/logout', postLogout);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router;