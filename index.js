// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const { startApp } = require('./utils');
const { mysqlRoutes, mongoRoutes, authRoutes } = require('./routes');
const { mysqlPool, mongoClient } = require('./database');

const app = express();
app.use(cors());

app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', mysqlRoutes);
app.use('/api', mongoRoutes);
app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'public', 'frontend')));

//check db connections
const mysqlConnection = (async () => {
  const conn = await mysqlPool.getConnection();
  await conn.ping();
  conn.release();
  return true;
})();

const mongoConnection = (async () => {
  await mongoClient.connect();
  return true;
})();

// const s3Connection = new Promise((resolve, reject) => {
//   if (!!process.env.AWS_S3_ACCESS_KEY && !!process.env.AWS_S3_SECRET) resolve();
//   else reject('S3 keys not found');
// });

startApp(app, [mysqlConnection, mongoConnection]);
