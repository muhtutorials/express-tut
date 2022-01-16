const path = require('path');

const express = require('express');

const adminRouts = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouts);
app.use(shopRoutes);

app.use(get404);

app.listen(3000);