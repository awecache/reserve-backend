const { MongoClient } = require('mongodb');

// const MONGO_URL = 'mongodb://localhost:27017';
// const MONGO_URL = `mongodb+srv://<username>:<password>@paf-cluster.7iwfx.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

const mongoClient = new MongoClient(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoClient;
