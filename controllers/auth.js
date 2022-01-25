const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();
const { validationResult } = require('express-validator');

const User = require('../models/user');

// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

exports.getLogin = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    oldInput: { email: '', password: ''},
  });
}

exports.getSignup = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: ''},
    validationErrors: []
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          pageTitle: 'Login',
          path: '/login',
          errorMessage: 'Invalid email or password.',
          oldInput: { email, password },
        });
      }
      bcrypt.compare(password, user.password)
        .then(areMatched => {
          if (areMatched) {
            req.session.user = user;
            // "save" method is used here to redirect only after session data was saved to DB
            return req.session.save(() => res.redirect('/'));
          }
          res.render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: 'Invalid email or password.',
            oldInput: { email, password },
          });
        })
        .catch(err => {
          console.log(err);
          res.render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: 'Invalid email or password.',
            oldInput: { email, password },
          });
        })
    })
    .catch(err => console.log(err));
}

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0]['msg'],
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      User.create({ email, password: hashedPassword, cart: { products: [] } })
        .then(() => {
          const msg = {
            to: email,
            from: 'express-tut@gmail.com',
            subject: 'SignUp',
            text: 'You have signed up successfully',
            html: '<strong>You have signed up successfully!</strong>',
          }
          // mg.messages.create('sandbox1da4abab42c94a0dbf61c48268278c23.mailgun.org', msg)
          //   .then(response => console.log(response)) // logs response data
          //   .catch(err => console.log(err))
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
}

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message
  });
}

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        const msg = {
          to: req.body.email,
          from: 'express-tut@gmail.com',
          subject: 'Password Reset',
          html: `
          <p>You have requested a password reset.</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.<p/>
          `,
        }
        mg.messages.create('sandbox1da4abab42c94a0dbf61c48268278c23.mailgun.org', msg)
          .then(response => console.log(response)) // logs response data
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err));
  });
}

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
}

exports.postNewPassword = (req, res) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err));
}