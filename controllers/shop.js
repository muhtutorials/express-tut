const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMSPERPAGE = 2;

exports.getIndex = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let totalItems;

  Product.find().countDocuments()
    .then(numOfProducts => {
      totalItems = numOfProducts;
      return Product.find().skip((page - 1) * ITEMSPERPAGE).limit(ITEMSPERPAGE);
    })
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        prods: products,
        currentPage: page,
        hasNextPage: ITEMSPERPAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMSPERPAGE)
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let totalItems;

  Product.find().countDocuments()
    .then(numOfProducts => {
      totalItems = numOfProducts;
      return Product.find().skip((page - 1) * ITEMSPERPAGE).limit(ITEMSPERPAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        prods: products,
        currentPage: page,
        hasNextPage: ITEMSPERPAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMSPERPAGE)
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
  req.user.populate('cart.products.productId')
    .then(user => {
      const products = user.cart.products;
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;

  Product.findById(productId)
   .then(product => req.user.addToCart(product))
   .then(() => res.redirect('/cart'))
   .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res) => {
  req.user.populate('cart.products.productId')
    .then(user => {
      const products = user.cart.products;
      let total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      })
      res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        products,
        totalSum: total
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user.populate('cart.products.productId')
    .then(user => {
      const products = user.cart.products.map(product => {
        return { product: { ...product.productId }, quantity: product.quantity }
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products
      });
      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders
      });
    })
    .catch(err => console.log(err))
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) return next(new Error('No order found.'));
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized.'));
      }
      const invoiceName = `invoice_${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment, filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(res);

      pdfDoc.fontSize(36).text('Invoice', {
        underline: true
      });

      pdfDoc.text('----------');

      let totalPrice = 0;

      order.products.forEach(p => {
        totalPrice += p.quantity * p.product.price;
        pdfDoc.fontSize(14).text(`${p.product.title} - ${p.quantity} x $${p.product.price}`);
      });

      pdfDoc.text('-----------------------');

      pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`);

      pdfDoc.end();

      // only good for small files
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) return next(err);
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'attachment, filename="' + invoiceName + '"');
      //   res.send(data);
      // });

      // or
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'attachment, filename="' + invoiceName + '"'
      // );
      // file.pipe(res);

    })
    .catch(err => next(err))
};