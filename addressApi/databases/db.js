'use strict';
const mysql = require('mysql');

const DB = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "city"
});

module.exports = DB
