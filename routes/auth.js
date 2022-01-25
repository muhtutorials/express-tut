const express = require('express');

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
const { signupValidator } = require('../validators/auth');

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post('/signup', signupValidator(), postSignup);

router.post('/logout', postLogout);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router;