const express = require("express");
const router = express.Router();
const db = require("../config/db"); // 🔥 IMPORT DB (FIX!)
const { createPengajuan, getPengajuan, cetakPDF } = require("../controllers/pengajuanController");

// =========================
// POST: SIMPAN PENGAJUAN
// =========================
router.post("/", createPengajuan);

// =========================
// GET: SEMUA DATA
// =========================
router.get("/", getPengajuan);

// =========================
// 🔥 ADMIN: AMBIL SEMUA DATA (HARUS SEBELUM /:id/cetak)
// =========================
router.get("/admin/list", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, j.nama AS jenis_surat 
      FROM pengajuan p
      JOIN jenis_surat j ON p.jenis_surat_id = j.id
      ORDER BY p.tanggal DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// 🔥 ADMIN: HAPUS DATA (HARUS SEBELUM /:id/cetak)
// =========================
router.delete("/admin/hapus/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM pengajuan WHERE id = ?", [req.params.id]);
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET: CETAK PDF (ROUTE DINAMIS - HARUS TERAKHIR)
// =========================
router.get("/:id/cetak", cetakPDF);

module.exports = router;