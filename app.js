const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { get404 } = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://igor:123321@mycluster.mwr2c.mongodb.net/express-tut?retryWrites=true&w=majority';

const app = express();
const store = MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'ratamahata', resave: false, saveUninitialized: false, store }));

app.use((req, res, next) => {
  User.findById('61e92ebcb30fa38416a92b29')
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
    console.log('Connected to MongoDB')
  })
  .catch(err => console.log(err));
