const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    products: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.products.findIndex(item => {
    return item.productId.toString() === product._id.toString();
  });

  const updatedCartProducts = [...this.cart.products];
  let newQuantity = 1;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.products[cartProductIndex].quantity + 1;
    updatedCartProducts[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartProducts.push({ productId: product._id, quantity: newQuantity })
  }

  this.cart = { products: updatedCartProducts };

  return this.save();
}

userSchema.methods.removeFromCart = function(id) {
  const updatedCartProducts = this.cart.products.filter(product => {
    return product.productId.toString() !== id.toString();
  });

  this.cart.products = updatedCartProducts;

  return this.save();
}

userSchema.methods.clearCart = function(id) {
  this.cart = { products: [] }
  return this.save();
}

module.exports = mongoose.model('User', userSchema);
