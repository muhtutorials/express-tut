const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { get404, get500 } = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://igor:123321@mycluster.mwr2c.mongodb.net/express-tut?retryWrites=true&w=majority';

const app = express();
const store = MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf({ cookie: false });

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'ratamahata', resave: false, saveUninitialized: false, store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', get500);
app.use(get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', { pageTitle: 'Error!', path: '' });
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
    console.log('Connected to MongoDB')
  })
  .catch(err => console.log(err));
