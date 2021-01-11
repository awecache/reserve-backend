const mysqlPool = require('./mysql');
const s3 = require('./s3');
const mongoClient = require('./mongoDb');

module.exports = { mysqlPool, s3, mongoClient };
