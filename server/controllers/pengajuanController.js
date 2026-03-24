const db = require("../config/db");
const generatePDF = require("../utils/pdfGenerator");
const generateNomorSurat = require("../utils/nomorSurat");

// =============================
// POST /pengajuan
// =============================
const createPengajuan = async (req, res) => {
  const { nama, nik, alamat, keperluan, jenis_surat_id } = req.body;

  // Validasi
  if (!nama || !nik || !alamat || !jenis_surat_id) {
    return res.status(400).json({
      message: "Data wajib lengkap",
    });
  }

  try {
    // 1. Dapatkan nomor urut terakhir
    const [lastRows] = await db.query(
      "SELECT id FROM pengajuan ORDER BY id DESC LIMIT 1"
    );
    
    const lastId = lastRows.length > 0 ? lastRows[0].id : 0;
    const nomor_surat = generateNomorSurat(lastId);

    // 2. INSERT dengan nomor_surat
    const sql = `
      INSERT INTO pengajuan (nama, nik, alamat, keperluan, jenis_surat_id, nomor_surat)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(
      sql,
      [nama, nik, alamat, keperluan, jenis_surat_id, nomor_surat]
    );

    res.json({
      message: "Data berhasil disimpan",
      id: result.insertId,
      nomor_surat: nomor_surat,
    });
  } catch (err) {
    console.error("❌ Error create pengajuan:", err);
    return res.status(500).json({
      message: "Gagal simpan data",
      error: err.message,
    });
  }
};

// =============================
// GET /pengajuan
// =============================
const getPengajuan = (req, res) => {
  const sql = `
    SELECT p.*, j.nama as jenis_surat
    FROM pengajuan p
    JOIN jenis_surat j ON p.jenis_surat_id = j.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal ambil data",
        error: err,
      });
    }

    res.json(results);
  });
};

// =============================
// GET /pengajuan/:id/cetak
// =============================
const cetakPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await db.query(
      `SELECT p.*, j.nama as jenis_surat, j.template
       FROM pengajuan p
       JOIN jenis_surat j ON p.jenis_surat_id = j.id
       WHERE p.id = ?`,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    const data = results[0];
    
    // Validasi: pastikan nomor_surat ada
    if (!data.nomor_surat) {
      console.error("❌ ERROR: Data tidak punya nomor_surat!");
      return res.status(500).json({
        message: "Data surat tidak valid (tidak ada nomor_surat)",
      });
    }

    console.log("✅ Generating PDF untuk:", data.nomor_surat);
    
    // kirim ke generator PDF dengan await
    await generatePDF(res, data);
    
  } catch (err) {
    console.error("❌ ERROR CETAK:", err);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: "Gagal generate PDF", 
        error: err.message 
      });
    }
  }
};

module.exports = {
  createPengajuan,
  getPengajuan,
  cetakPDF,
};