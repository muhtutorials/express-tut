class User {

}

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = new ObjectId(id);
//   }
//
//   save() {
//     return getDb().collection('users').insertOne(this);
//   }
//
//   addToCart(product) {
//     const cartProductIndex = this.cart.products.findIndex(item => {
//       return item.productId.toString() === product._id.toString();
//     });
//
//     const updatedCartProducts = [...this.cart.products];
//     let newQuantity = 1;
//
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.products[cartProductIndex].quantity + 1;
//       updatedCartProducts[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartProducts.push({ productId: new ObjectId(product._id), quantity: newQuantity })
//     }
//
//     const updatedCart = { products: updatedCartProducts };
//     return getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }
//
//   getCart() {
//     const productIds = this.cart.products.map(product => product.productId);
//     return getDb().collection('products').find({ _id: { $in: productIds } }).toArray()
//       .then(products => {
//         return products.map(product => {
//           return { ...product, quantity: this.cart.products.find(p => {
//             return p.productId.toString() === product._id.toString()
//           }).quantity }
//         })
//       });
//   }
//
//   deleteProductFromCart(id) {
//     const updatedCartProducts = this.cart.products.filter(product => {
//       return product.productId.toString() !== id.toString();
//     });
//
//     const updatedCart = { products: updatedCartProducts };
//     return getDb().collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }
//
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           products: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//             email: this.email
//           }
//         }
//         return db.collection('orders').insertOne(order)
//       })
//       .then(() => {
//         this.cart = { products: [] };
//         return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//       });
//
//   }
//
//   getOrders() {
//     return getDb().collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
//   }
//
//   static findById(id) {
//     return getDb().collection('users').findOne({ _id: new ObjectId(id) });
//   }
// }

module.exports = User;