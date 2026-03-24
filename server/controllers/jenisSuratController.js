const db = require("../config/db");

const getJenisSurat = (req, res) => {
  const sql = "SELECT * FROM jenis_surat";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal ambil jenis surat",
        error: err,
      });
    }

    res.json(results);
  });
};

module.exports = {
  getJenisSurat,
};