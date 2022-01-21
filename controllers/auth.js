exports.getLogin = (req, res) => {
  res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

exports.postLogin = (req, res) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
}