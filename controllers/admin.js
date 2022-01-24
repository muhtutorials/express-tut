const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const userId = req.user._id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: { title, imageUrl, description, price },
      errorMessage: errors.array()[0]['msg'],
      validationErrors: errors.array()
    });
  }

  const product = new Product({ title, imageUrl, description, price, userId });
  
  product.save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) res.redirect('/');
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: false,
        product,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: { productId, title, imageUrl, description, price },
      errorMessage: errors.array()[0]['msg'],
      validationErrors: errors.array()
    });
  }

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) res.redirect('/');
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      product.save()
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        prods: products
      });
    })
    .catch(err => console.log(err));
}
