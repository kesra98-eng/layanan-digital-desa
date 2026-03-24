# 🚀 QUICK START GUIDE - TEST QR CODE

## ⚡ LANGKAH CEPAT (5 MENIT)

### 1️⃣ Fix Database (WAJIB!)
```sql
-- Buka phpMyAdmin: http://localhost/phpmyadmin
-- Klik tab "SQL"
-- Copy paste ini:

USE surat_desa;

-- Cek apakah ada kolom nomor_surat
DESCRIBE pengajuan;

-- Jika tidak ada, tambahkan:
ALTER TABLE pengajuan ADD COLUMN nomor_surat VARCHAR(100);

-- Update data lama dengan nomor surat
UPDATE pengajuan 
SET nomor_surat = CONCAT('470/', LPAD(id, 3, '0'), '/DS/III/2025')
WHERE nomor_surat IS NULL OR nomor_surat = '';

-- Verifikasi
SELECT id, nama, nomor_surat FROM pengajuan ORDER BY id DESC LIMIT 5;
```

### 2️⃣ Restart Server
```bash
# Stop server jika running (Ctrl+C)
# Kemudian start ulang
npm start
```

**Expected Output:**
```
❌ Database gagal: ... (jika MySQL belum running)
ATAU
🔥 Database terkoneksi (POOL AKTIF)
🔥 Server jalan di http://localhost:3000
```

### 3️⃣ Test Input Data Baru
1. **Buka browser:** http://localhost:3000
2. **Isi form:**
   ```
   Nama: Budi Santoso
   NIK: 3301123456789012
   Alamat: Jl. Mawar No. 12 RT 01 RW 02
   Keperluan: Syarat Lamaran Kerja
   Jenis Surat: Surat Keterangan Usaha
   ```
3. **Klik:** "Kirim Pengajuan"

**Expected Result:**
```
✅ Pengajuan berhasil disimpan
[🖨️ Cetak Surat]
```

### 4️⃣ Test Cetak PDF
1. **Klik tombol:** "🖨️ Cetak Surat"
2. **PDF akan terbuka** di tab baru
3. **Periksa QR Code** di kiri bawah dokumen

**Checklist QR Code:**
- [ ] ✅ QR Code **MUNCUL** di kiri bawah
- [ ] ✅ Ukuran sekitar 3x3 cm (90x90 px)
- [ ] ✅ Ada teks "Scan untuk validasi" di bawah QR
- [ ] ✅ QR terlihat jelas (tidak blur/pixelated)

### 5️⃣ Test Scan QR
1. **Screenshot** QR code dari PDF
2. **Buka Google Lens** atau QR scanner di HP
3. **Scan QR code**
4. **HP akan membuka** URL validasi

**Expected URL:**
```
http://localhost:3000/cek-surat/470-XXX-DS-III-2025
```

**Expected Page:**
```
┌─────────────────────────────────┐
│ ✅ SURAT TERVERIFIKASI          │
│                                 │
│ Dokumen ini terdaftar dalam     │
│ sistem Desa Ambokulon           │
│                                 │
│ Nomor    : 470/XXX/DS/III/2025 │
│ Nama     : Budi Santoso         │
│ Jenis    : Surat Keterangan...  │
│ Tanggal  : 24 Maret 2025        │
└─────────────────────────────────┘
```

---

## 🔍 JIKA QR TIDAK MUNCUL

### Check Server Console

**Normal Logs (✅):**
```
✅ Generating PDF untuk: 470/006/DS/III/2025
✅ Generating QR for URL: http://localhost:3000/cek-surat/470-006-DS-III-2025
✅ QR generated successfully, placing at: { x: 60, y: 165 }
✅ QR placed successfully
```

**Error Logs (❌):**
```
❌ ERROR: Data tidak punya nomor_surat!
ATAU
❌ ERROR CETAK: Cannot read property 'nomor_surat' of undefined
```

### Quick Fix SQL

Jika dapat error "Data tidak punya nomor_surat":

```sql
-- Fix semua data sekaligus
UPDATE pengajuan 
SET nomor_surat = CONCAT(
    '470/', 
    LPAD(id, 3, '0'), 
    '/DS/',
    CASE MONTH(tanggal)
        WHEN 1 THEN 'I' WHEN 2 THEN 'II' WHEN 3 THEN 'III'
        WHEN 4 THEN 'IV' WHEN 5 THEN 'V' WHEN 6 THEN 'VI'
        WHEN 7 THEN 'VII' WHEN 8 THEN 'VIII' WHEN 9 THEN 'IX'
        WHEN 10 THEN 'X' WHEN 11 THEN 'XI' WHEN 12 THEN 'XII'
    END,
    '/',
    YEAR(tanggal)
)
WHERE nomor_surat IS NULL OR nomor_surat = '';

-- Verifikasi
SELECT COUNT(*) as total_fixed FROM pengajuan WHERE nomor_surat IS NOT NULL;
```

---

## 🎯 TROUBLESHOOTING CEPAT

| Problem | Solution |
|---------|----------|
| ❌ Server tidak start | Pastikan XAMPP MySQL running |
| ❌ Form tidak muncul | Refresh browser (Ctrl+F5) |
| ❌ Submit error | Cek console log (F12) |
| ❌ QR tidak muncul | Jalankan UPDATE SQL di atas |
| ❌ QR tidak bisa scan | Pastikan URL validasi accessible |
| ❌ PDF kosong/rusak | Cek await di routes |

---

## 📱 SCREENSHOT CHECKLIST

Setelah test, pastikan dapat screenshot:

### 1. Form Terisi
```
[✓] Nama lengkap
[✓] NIK 16 digit
[✓] Alamat lengkap
[✓] Keperluan
[✓] Jenis surat terpilih
```

### 2. Response Sukses
```
✅ Pengajuan berhasil disimpan
[🖨️ Cetak Surat] button visible
```

### 3. PDF dengan QR Code
```
[✓] Kop surat lengkap
[✓] Nomor surat ada
[✓] QR Code di kiri bawah (90x90px)
[✓] Text "Scan untuk validasi"
```

### 4. Validasi QR Berhasil
```
[✓] Halaman validasi terbuka
[✓] Status "TERVERIFIKASI"
[✓] Data surat tampil lengkap
```

---

## 🆘 BUTUH BANTUAN?

Jika masih ada masalah, kirim informasi ini:

### 1. Database Structure
```sql
DESCRIBE pengajuan;
```

### 2. Sample Data
```sql
SELECT id, nama, nomor_surat, tanggal 
FROM pengajuan 
ORDER BY id DESC 
LIMIT 3;
```

### 3. Server Logs
```
Copy console output dari terminal tempat npm start running
```

### 4. Browser Console
```
Tekan F12 → Console tab → Copy semua pesan error/warning
```

### 5. Screenshot
- Form input
- Response setelah submit
- PDF yang dihasilkan (zoom ke area QR)
- Error message (jika ada)

---

## ✅ VERIFIKASI FINAL

Setelah semua fix, seharusnya:

**Frontend (http://localhost:3000):**
- [ ] Form tampil dengan benar
- [ ] Dropdown jenis surat terisi
- [ ] Submit berhasil tanpa error
- [ ] Tombol cetak muncul

**Backend (Server Console):**
- [ ] Database connected
- [ ] No errors on submit
- [ ] QR generation logs visible
- [ ] PDF generated successfully

**PDF Output:**
- [ ] Kop surat lengkap
- [ ] Data pemohon benar
- [ ] **QR Code muncul** ⭐
- [ ] QR ukuran cukup (90x90px)
- [ ] QR bisa discan

**QR Validation:**
- [ ] URL validasi accessible
- [ ] Halaman validasi tampil
- [ ] Data surat cocok
- [ ] Status terverifikasi

---

**Status:** READY TO TEST  
**Time Estimate:** 5-10 menit  
**Success Rate:** 99% (jika database sudah fix)  

🚀 **SELAMAT TESTING!**
