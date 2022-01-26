const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  postDeleteProduct
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { productValidator } = require('../validators/admin');

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);

router.post('/add-product', productValidator(), isAuth, postAddProduct);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product', productValidator(), isAuth, postEditProduct);

router.post('/delete-product', isAuth, postDeleteProduct);

router.get('/products', isAuth, getProducts);

module.exports = router;
