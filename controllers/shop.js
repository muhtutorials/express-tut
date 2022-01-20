const Product = require('../models/product');

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
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', { pageTitle: 'Cart', path: '/cart', products });
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId)
   .then(product => {
      req.user.addToCart(product);
      res.redirect('/cart');
   })
   .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  req.user.deleteProductFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
}

exports.postOrder = (req, res) => {
  req.user.addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
  req.user.getOrders()
    .then(orders => {
      res.render('shop/orders', { pageTitle: 'Orders', path: '/orders', orders });
    })
    .catch(err => console.log(err))
}

// exports.getCheckout = (req, res) => {
//   res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
// }