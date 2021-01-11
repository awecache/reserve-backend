const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017';

const mongoClient = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoClient;
