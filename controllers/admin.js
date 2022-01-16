const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    if (!product) res.render('/');
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product
    });
  });
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price} = req.body;
  const product = new Product(productId, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.delete(productId);
  res.redirect('/admin/products');
};


exports.getProducts = (req, res) => {
  Product.getAll(products => {
      res.render('admin/products', { pageTitle: 'Admin Products', path: '/admin/products', prods: products });
  });
};
