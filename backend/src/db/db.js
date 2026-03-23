const mysql = require('mysql2');
const dbConfig = require('../configs/dbConfig')
const db = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

module.exports = db