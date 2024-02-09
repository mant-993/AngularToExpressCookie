var mariadb = require('mariadb');
require('dotenv').config()
 
var pool = 
  mariadb.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USERNAME, 
    password: process.env.PASSWORD, 
    database: process.env.DATABASE 
  });
 
module.exports = Object.freeze({
  pool: pool
});