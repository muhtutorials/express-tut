const express = require('express');

const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getCheckout,
  getCheckoutSuccess,
  getOrders,
  getInvoice
} = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

router.get('/checkout', isAuth, getCheckout);

// This route can be accessed by manually typing the url in the url bar,
// that's why it's unreliable for checking paid orders.
// Paid orders should be checked in the Stripe dashboard.
// To create a reliable success page with paid orders Stripe webhooks should be used
// which don't work with a local development server.
router.get('/checkout/success', isAuth, getCheckoutSuccess);

router.get('/checkout/cancel', isAuth, getCheckout);

router.get('/orders', isAuth, getOrders);

router.get('/orders/:orderId', isAuth, getInvoice);

module.exports = router;
