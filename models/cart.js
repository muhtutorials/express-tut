const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static getCart(callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(null);
      } else {
        const cart = JSON.parse(data);
        callback(cart);
      }
    });
  }

  static addProduct(id, productPrice) {
    let cart = { products: [], totalPrice: 0 };
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err) {
        cart = JSON.parse(data);
      }
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1
        };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, quantity: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + parseInt(productPrice);

      fs.writeFile(filePath, JSON.stringify(cart), err => {
        console.log(err);
      });
    })
  }

  static deleteProduct(id, price) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return;
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find(product => product.id === id);
      // exit function if on deleting product in admin section there's no this product in the cart
      if (!product) {
        return;
      }
      const quantity = product.quantity;
      updatedCart.products = updatedCart.products.filter(item => item.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - price * quantity;

      fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }
}