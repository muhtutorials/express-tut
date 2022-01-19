const path = require('path');

const express = require('express');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const mongoConnect = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findByPk(1)
//   .then(user => {
//     req.user = user;
//     next();
//   })
//   .catch(err => console.log(err));
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(get404);

mongoConnect(client => {
  app.listen(3000);
});
