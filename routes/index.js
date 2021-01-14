const s3Routes = require('./s3');
const mysqlRoutes = require('./mysql');
const mongoRoutes = require('./mongoDb');
const authRoutes = require('./auth');

module.exports = {
  s3Routes,
  mysqlRoutes,
  mongoRoutes,
  authRoutes
};
