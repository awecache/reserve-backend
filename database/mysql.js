const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

console.log(
  'dirname:',
  path.join(__dirname, '..', 'certs', 'ca-certificate.crt')
);

const {
  MYSQL_SERVER,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_CONN_LIMIT,
  MYSQL_DATABASE
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_SERVER || 'localhost',
  port: MYSQL_PORT,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  connectionLimit: MYSQL_CONN_LIMIT || 4,
  connectTimeout: 20000,
  waitForConnections: true,
  /* comment out ssl if running mySQL locally. 
  this is for connecting to digital ocean */
  ssl: {
    ca: fs.readFileSync(
      path.join(__dirname, '..', 'certs', 'ca-certificate.crt')
    )
  },
  timezone: '+08:00'
});

module.exports = pool;
