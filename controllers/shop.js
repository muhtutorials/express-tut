const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', path: '/', prods: products});
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', { pageTitle: 'All Products', path: '/products', prods: products });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', { pageTitle: product.title, path: '/products', product });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
  req.user.populate('cart.products.productId')
    .then(user => {
      const products = user.cart.products;
      res.render('shop/cart', { pageTitle: 'Cart', path: '/cart', products });
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId)
   .then(product => req.user.addToCart(product))
   .then(() => res.redirect('/cart'))
   .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
}

exports.postOrder = (req, res) => {
  req.user.populate('cart.products.productId')
    .then(user => {
      const products = user.cart.products.map(product => {
        return { product: { ...product.productId }, quantity: product.quantity }
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', { pageTitle: 'Orders', path: '/orders', orders });
    })
    .catch(err => console.log(err))
}

// exports.getCheckout = (req, res) => {
//   res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
// }