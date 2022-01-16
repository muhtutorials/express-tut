const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const filePath = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (callback) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) callback([]);
    callback(JSON.parse(data));
  })
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id);
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random();
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static getAll(callback) {
    getProductsFromFile(callback)
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(item => item.id === id);
      callback(product);
    });
  };

  static delete(id) {
    getProductsFromFile(products => {
      const product = products.find(item => item.id === id)
      const updatedProducts = products.filter(item => item.id !== id);
      fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
          if (!err) {
            Cart.deleteProduct(id, product.price);
          }
      });
    });
  }
}