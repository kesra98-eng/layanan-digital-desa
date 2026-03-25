const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db"); // Pastikan path benar

// =========================
// 🔥 TEST DATABASE CONNECTION
// =========================
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ DATABASE CONNECTED!");
    console.log("📊 Connected to:", process.env.MYSQLDATABASE || "railway");
    conn.release();
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.message);
    console.error("🔧 Check Railway environment variables!");
  }
})();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// =========================
// 🔥 ROUTE UNTUK ADMIN PAGE
// =========================
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// Route Utama
const pengajuanRoutes = require("./routes/pengajuanRoutes");
const jenisSuratRoutes = require("./routes/jenisSuratRoutes");

app.use("/pengajuan", pengajuanRoutes);
app.use("/jenis-surat", jenisSuratRoutes);

// =========================
// 🔥 ERROR HANDLER GLOBAL
// =========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

// =========================
// 🔥 ROUTE VALIDASI QR (NEW)
// =========================
app.get("/cek-surat/:nomor", async (req, res) => {
  try {
    // 🔥 CONVERT DARI QR (strip) KE FORMAT DATABASE (slash)
    const nomorAsli = req.params.nomor.replace(/-/g, "/");

    // 🔥 LOGGING UNTUK DEBUGGING
    console.log("🔍 QR scan:", req.params.nomor);
    console.log("🔄 Converted:", nomorAsli);
    
    const [rows] = await db.query(
      `SELECT p.*, j.nama AS jenis_surat 
       FROM pengajuan p 
       JOIN jenis_surat j ON p.jenis_surat_id = j.id 
       WHERE p.nomor_surat = ?`, 
      [nomorAsli]
    );

    if (rows.length === 0) {
      console.error("❌ Document not found:", nomorAsli);
      return res.status(404).send(`
        <h2 style="color:red;">❌ Surat Tidak Ditemukan</h2>
        <p>Nomor yang dicari: ${nomorAsli}</p>
        <p>Nomor dari QR: ${req.params.nomor}</p>
      `);
    }

    const data = rows[0];
    console.log("✅ Document found:", data.nomor_surat);
    
    // Kirim tampilan HTML Sederhana untuk pengecekan HP
    res.send(`
      <div style="font-family:sans-serif; text-align:center; padding: 20px; border: 5px solid green;">
        <h2 style="color:green;">✅ SURAT TERVERIFIKASI</h2>
        <hr>
        <p>Dokumen ini terdaftar dalam sistem Desa Ambokulon</p>
        <table style="text-align:left; margin:auto;">
          <tr><td><b>Nomor</b></td><td>: ${data.nomor_surat}</td></tr>
          <tr><td><b>Nama</b></td><td>: ${data.nama}</td></tr>
          <tr><td><b>Jenis</b></td><td>: ${data.jenis_surat}</td></tr>
          <tr><td><b>Tanggal</b></td><td>: ${new Date(data.tanggal).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })}</td></tr>
        </table>
        <br>
        <small>Sistem Informasi Layanan Digital Desa Ambokulon</small>
      </div>
    `);
  } catch (err) {
    console.error("❌ QR validation error:", err.message);
    res.status(500).send("Error validating document");
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Server jalan di http://localhost:${PORT}`);
  console.log(`🚀 Ready for deployment!`);
});