const mysql = require("mysql2/promise");

// =========================
// 🔥 CONFIG DATABASE (RAILWAY PRODUCTION READY)
// =========================
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE || "railway", // 🔥 fallback aman
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;