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
const { body } = require('express-validator');

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);

router.post(
  '/add-product',
  body('title')
    .isLength({ min: 3 })
    .trim(),
  body('imageUrl')
    .isURL(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 8, max: 500 })
    .trim(),
  isAuth,
  postAddProduct
);

router.get(
  '/edit-product/:productId',
  body('title')
    .isLength({ min: 3 })
    .trim(),
  body('imageUrl')
    .isURL(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 8, max: 500 })
    .trim(),
  isAuth,
  getEditProduct
);

router.post('/edit-product', isAuth, postEditProduct)

router.post('/delete-product', isAuth, postDeleteProduct)

router.get('/products', isAuth, getProducts);

module.exports = router;
