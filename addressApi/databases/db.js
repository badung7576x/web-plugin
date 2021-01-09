'use strict';
require('dotenv').config({path: __dirname + '/../.env'})
const mysql = require('mysql');
const { Pool } = require('pg');
let DB = null;

const dataType = process.env.DB_TYPE;
if(dataType !== 'mysql') {
  DB = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    database: process.env.DB_NAME || "province",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || ""
});
} else {
  DB = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "province",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || ""
  });
}


module.exports = DB
