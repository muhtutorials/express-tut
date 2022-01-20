const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient
    .connect('mongodb+srv://igor:123321@mycluster.mwr2c.mongodb.net/express-tut?retryWrites=true&w=majority')
    .then(client => {
      _db = client.db();
      console.log('MongoDB connection successfull!');
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
