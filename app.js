const path = require('path');
const fs = require('fs');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { get404, get500 } = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf({ cookie: false });
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // directory specified in the cb function must be created manually otherwise an error is thrown
    cb(null, path.join('data', 'images'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.set('view engine', 'ejs');

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// compress all responses (usually provided by hosting provider)
app.use(compression());

// HTTP request logger middleware (usually provided by hosting provider)
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));
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

// app.get('/500', get500);
app.use(get404);

// app.use((error, req, res, next) => {
//   res.status(500).render('500', { pageTitle: 'Error!', path: '' });
// });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(3000);
    console.log('Connected to MongoDB server')
  })
  .catch(err => console.log(err));
