const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', path: '/', prods: products});
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', { pageTitle: 'All Products', path: '/products', prods: products });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then(product => {
      console.log(product)
      res.render('shop/product-detail', { pageTitle: product.title, path: '/products', product });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', { pageTitle: 'Cart', path: '/cart', products });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
      Cart.addProduct(productId, product.price);
  });
  res.redirect('/');
}

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
      Cart.deleteProduct(productId, product.price);
  });
  res.redirect('/cart');
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', { pageTitle: 'Orders', path: '/orders' });
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}