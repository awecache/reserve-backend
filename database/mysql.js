const mysql = require('mysql2/promise');

const {
  MYSQL_SERVER,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_CONN_LIMIT,
  MYSQL_DATABASE
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_SERVER,
  port: MYSQL_PORT,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  connectionLimit: MYSQL_CONN_LIMIT
});

module.exports = pool;
