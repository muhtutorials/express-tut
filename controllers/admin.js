const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  const userId = req.user._id;

  const product = new Product(title, imageUrl, description, price, userId);
  
  product.save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) res.render('/');
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, imageUrl, description, price } = req.body;
    const product = new Product(title, imageUrl, description, price, productId);
    product.save()
      .then(result => res.redirect('/admin/products'))
      .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', { pageTitle: 'Admin Products', path: '/admin/products', prods: products });
    })
    .catch(err => console.log(err));
}
