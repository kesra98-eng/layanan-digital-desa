const mysql = require("mysql2");

// =========================
// 🔥 CONFIG DATABASE (RAILWAY PRODUCTION READY)
// =========================
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "surat_desa",
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Database gagal:", err.message);
  } else {
    console.log("🔥 Database terkoneksi");
    conn.release();
  }
});

module.exports = pool;