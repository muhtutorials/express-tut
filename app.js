const path = require('path');

const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

(async () => {
  Product.belongsTo(User, { onDelete: 'CASCADE' });
  // without this line user object won't have association methods like "createProduct"
  User.hasMany(Product);
  User.hasOne(Cart);
  Cart.belongsTo(User, { onDelete: 'CASCADE' });
  Cart.belongsToMany(Product, { through: CartItem });
  Product.belongsToMany(Cart, { through: CartItem });
  // "force: true" option makes the sync method recreate tables on every server startup
  // await sequelize.sync({force: true});
  await sequelize.sync();
})();

app.listen(3000);