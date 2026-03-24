-- ========================================
-- FIX & TESTING SCRIPT
-- ========================================

-- 1. CEK STRUKTUR TABEL
DESCRIBE pengajuan;
DESCRIBE jenis_surat;

-- 2. TAMBAH KOLOM nomor_surat JIKA BELUM ADA
ALTER TABLE pengajuan ADD COLUMN IF NOT EXISTS nomor_surat VARCHAR(100);

-- 3. UPDATE DATA LAMA YANG TIDAK PUNYA NOMOR SURAT
-- Generate nomor surat berdasarkan ID
UPDATE pengajuan 
SET nomor_surat = CONCAT(
    '470/', 
    LPAD(id, 3, '0'), 
    '/DS/',
    CASE MONTH(tanggal)
        WHEN 1 THEN 'I'
        WHEN 2 THEN 'II'
        WHEN 3 THEN 'III'
        WHEN 4 THEN 'IV'
        WHEN 5 THEN 'V'
        WHEN 6 THEN 'VI'
        WHEN 7 THEN 'VII'
        WHEN 8 THEN 'VIII'
        WHEN 9 THEN 'IX'
        WHEN 10 THEN 'X'
        WHEN 11 THEN 'XI'
        WHEN 12 THEN 'XII'
    END,
    '/',
    YEAR(tanggal)
)
WHERE nomor_surat IS NULL OR nomor_surat = '';

-- 4. VERIFIKASI DATA SUDAH PUNYA NOMOR SURAT
SELECT id, nama, jenis_surat_id, nomor_surat, tanggal 
FROM pengajuan 
ORDER BY id DESC 
LIMIT 10;

-- 5. TEST QUERY UNTUK CETAK PDF (Simulasi)
SELECT p.*, j.nama as jenis_surat, j.template
FROM pengajuan p
JOIN jenis_surat j ON p.jenis_surat_id = j.id
WHERE p.id = 1;  -- Ganti dengan ID yang ada di database kamu

-- 6. CEK SEMUA DATA YANG BELUM PUNYA NOMOR SURAT
SELECT COUNT(*) as data_tanpa_nomor 
FROM pengajuan 
WHERE nomor_surat IS NULL OR nomor_surat = '';

-- 7. CLEANUP (OPTIONAL - HAPUS SEMUA DATA)
-- TRUNCATE TABLE pengajuan;
-- TRUNCATE TABLE jenis_surat;

-- 8. RE-INSERT JENIS SURAT JIKA PERLU
INSERT INTO jenis_surat (nama, template) VALUES 
('Surat Keterangan Usaha', 
 'Yang bertanda tangan di bawah ini Kepala Desa Ambokulon menerangkan bahwa {{nama}}, NIK {{nik}}, beralamat di {{alamat}}, adalah pemilik usaha yang berdomisili di {{alamat}}. Usaha tersebut bergerak dalam bidang {{keperluan}}. Surat keterangan ini diberikan untuk keperluan {{keperluan}}.'),

('Surat Keterangan Tidak Mampu', 
 'Yang bertanda tangan di bawah ini Kepala Desa Ambokulon menerangkan bahwa {{nama}}, NIK {{nik}}, beralamat di {{alamat}}, adalah warga yang termasuk dalam kategori keluarga tidak mampu. Surat keterangan ini diberikan untuk keperluan {{keperluan}}.'),

('Surat Pengantar KTP', 
 'Yang bertanda tangan di bawah ini Kepala Desa Ambokulon menerangkan bahwa {{nama}}, NIK {{nik}}, beralamat di {{alamat}}, adalah penduduk desa kami yang akan melakukan pembuatan/penggantian KTP. Surat pengantar ini diberikan untuk keperluan {{keperluan}}.')
ON DUPLICATE KEY UPDATE nama=VALUES(nama);
