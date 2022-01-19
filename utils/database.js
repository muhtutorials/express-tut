const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient
    .connect('mongodb+srv://igor:123321@mycluster.mwr2c.mongodb.net/express-tut?retryWrites=true&w=majority')
    .then(client => {
      callback(client);
      console.log(client);
    })
    .catch(err => console.log(err));
}

module.exports = mongoConnect;