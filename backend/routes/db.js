const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MSQLHOST,
  user: process.env.MSQLUSER,
  password: process.env.MSQLPASSWORD,
  database: process.env.MSQLNAME,
  port: Number(process.env.MSQLPORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
