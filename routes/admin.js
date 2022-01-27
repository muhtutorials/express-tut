const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
  getProducts
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { productValidator } = require('../validators/admin');

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);

router.post('/add-product', productValidator(), isAuth, postAddProduct);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product', productValidator(), isAuth, postEditProduct);

router.delete('/products/:productId', isAuth, deleteProduct);

router.get('/products', isAuth, getProducts);

module.exports = router;
