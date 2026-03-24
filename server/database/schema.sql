-- ========================================
-- DATABASE STRUCTURE - SURAT_DESA
-- ========================================

-- Buat Database
CREATE DATABASE IF NOT EXISTS surat_desa;
USE surat_desa;

-- Tabel: jenis_surat
CREATE TABLE IF NOT EXISTS jenis_surat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    template TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: pengajuan
CREATE TABLE IF NOT EXISTS pengajuan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    alamat TEXT NOT NULL,
    keperluan VARCHAR(255),
    jenis_surat_id INT NOT NULL,
    nomor_surat VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jenis_surat_id) REFERENCES jenis_surat(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- DATA DUMMY UNTUK TESTING
-- ========================================

INSERT INTO jenis_surat (nama, template) VALUES 
('Surat Keterangan Usaha', 
 'Yang bertanda tangan di bawah ini Kepala Desa Ambokulon menerangkan bahwa {{nama}}, NIK {{nik}}, beralamat di {{alamat}}, adalah pemilik usaha yang berdomisili di {{alamat}}. Usaha tersebut bergerak dalam bidang {{keperluan}}. Surat keterangan ini diberikan untuk keperluan {{keperluan}}.'),

('Surat Keterangan Tidak Mampu', 
 'Yang bertanda tangan di bawah ini Kepala Desa Ambokulon menerangkan bahwa {{nama}}, NIK {{nik}}, beralamat di {{alamat}}, adalah warga yang termasuk dalam kategori keluarga tidak mampu. Surat keterangan ini diberikan untuk keperluan {{keperluan}}.'),

('Surat Pengantar KTP', 
 'Yang bertanda tangan di bawah ini Kepala Desa Ambokulon menerangkan bahwa {{nama}}, NIK {{nik}}, beralamat di {{alamat}}, adalah penduduk desa kami yang akan melakukan pembuatan/penggantian KTP. Surat pengantar ini diberikan untuk keperluan {{keperluan}}.');
