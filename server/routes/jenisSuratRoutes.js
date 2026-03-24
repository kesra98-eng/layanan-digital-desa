const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =========================
// GET JENIS SURAT
// =========================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nama FROM jenis_surat");

    res.json(rows);
  } catch (err) {
    console.error("❌ ERROR JENIS SURAT:", err);

    res.status(500).json({
      message: "Gagal ambil jenis surat",
      error: err.message,
    });
  }
});

module.exports = router;