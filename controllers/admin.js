const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, description, price } = req.body;
  // const userId = req.user.id;
  // Product.create({ title, imageUrl, description, price, userId })
  // or
  req.user.createProduct({ title, imageUrl, description, price })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const productId = req.params.productId;
  // Product.findByPk(productId)
  req.user.getProducts({ 'where': { id: productId } })
    .then(products => {
      const product = products[0]
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
  Product.findByPk(productId)
    .then(product => {
      if (!product) res.render('/');
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(result => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.destroy({ where: { id: productId } })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};


exports.getProducts = (req, res) => {
  // Product.findAll()
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', { pageTitle: 'Admin Products', path: '/admin/products', prods: products });
    })
    .catch(err => console.log(err));
}
