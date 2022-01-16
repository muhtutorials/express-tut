const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
  Product.getAll(products => {
      res.render('shop/index', { pageTitle: 'Shop', path: '/', prods: products});
  });
};

exports.getProducts = (req, res) => {
  Product.getAll(products => {
      res.render('shop/product-list', { pageTitle: 'All Products', path: '/products', prods: products });
  });
};

exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
      res.render('shop/product-detail', { pageTitle: product.title, path: '/products', product });
  });
};

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.getAll(products => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(item => item.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, quantity: cartProductData.quantity });
        }
      }
      res.render('shop/cart', { pageTitle: 'Cart', path: '/cart', products: cartProducts });
    })
  })
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