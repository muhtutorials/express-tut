const { ObjectId } = require('mongodb');

const { getDb } = require('../utils/database');

class Product {
  constructor(title, imageUrl, description, price, userId, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.userId = userId;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    if (this._id) {
      return getDb().collection('products').updateOne({ _id: this._id }, { $set: this });   
    }
    return getDb().collection('products').insertOne(this);
  }

  static fetchAll() {
    // "find" method returns a "cursor" object
    return getDb().collection('products').find().toArray();
  }

  static findById(id) {
    return getDb().collection('products').find({ _id: new ObjectId(id) }).next();
  }

  static deleteById(id) {
    return getDb().collection('products').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Product;