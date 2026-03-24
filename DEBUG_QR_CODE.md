# 🔧 DEBUGGING GUIDE - QR CODE TIDAK MUNCUL

## 📋 CHECKLIST MASALAH & SOLUSI

### ✅ 1. DATABASE STRUCTURE
**Masalah:** Tabel tidak punya kolom `nomor_surat`
**Solusi:** 
```sql
-- Cek struktur tabel
DESCRIBE pengajuan;

-- Jika tidak ada kolom nomor_surat, tambahkan:
ALTER TABLE pengajuan ADD COLUMN nomor_surat VARCHAR(100);
```

### ✅ 2. DATA TIDAK PUNYA NOMOR SURAT
**Masalah:** Data lama yang sudah diinput tidak punya nomor_surat
**Solusi:**
```sql
-- Update data lama dengan nomor surat default
UPDATE pengajuan 
SET nomor_surat = CONCAT('470/', LPAD(id, 3, '0'), '/DS/III/2025')
WHERE nomor_surat IS NULL OR nomor_surat = '';
```

### ✅ 3. CEK LOG SERVER
Saat cetak PDF, perhatikan console log server:
- ✅ "Generating QR for URL: ..." → QR sedang digenerate
- ✅ "QR generated successfully" → QR berhasil dibuat
- ✅ "QR placed successfully" → QR berhasil ditempel di PDF
- ❌ "ERROR:" → Ada error, lihat detailnya

### ✅ 4. VALIDASI URL QR CODE
URL QR Code harus accessible:
```
http://localhost:3000/cek-surat/470-001-DS-III-2025
```
Coba buka di browser, harus muncul halaman validasi.

---

## 🧪 CARA TESTING LENGKAP

### Step 1: Setup Database
```bash
# Buka MySQL/phpMyAdmin
mysql -u root -p

# Jalankan schema
source e:\web desa\Layanan_Digital\server\database\schema.sql
```

### Step 2: Restart Server
```bash
npm start
```

### Step 3: Test Input Data
1. Buka http://localhost:3000
2. Isi form dengan data valid
3. Submit → Harus muncul tombol "🖨️ Cetak Surat"

### Step 4: Test Cetak PDF
1. Klik tombol "Cetak Surat"
2. PDF akan terbuka di tab baru
3. **CEK:**
   - ✅ QR Code muncul di kiri bawah
   - ✅ Ada teks "Scan untuk validasi"
   - ✅ QR bisa discan (gunakan HP)

### Step 5: Debug Jika QR Tidak Muncul
**Di browser console (F12):**
- Cek ada error atau tidak
- Cek network tab → status code harus 200

**Di server console:**
- Lihat log "Generating QR for URL: ..."
- Lihat log "QR generated successfully"
- Jika ada error, akan tampil detail

---

## 🔍 MASALAH UMUM & FIX

### ❌ Problem: "Data tidak punya nomor_surat"
**Fix:**
```sql
UPDATE pengajuan SET nomor_surat = '470/001/DS/III/2025' WHERE id = 1;
```

### ❌ Problem: QR Code tertutup teks
**Sudah diperbaiki di:** `pdfGenerator.js` baris 86-110
- Posisi Y sekarang dihitung otomatis
- Spacing ditambah (50px + 20px offset)

### ❌ Problem: QR Code terlalu kecil/gelap
**Sudah diperbaiki di:** `pdfGenerator.js` line 95
```javascript
width: 120,        // Lebih besar
margin: 2,         // Margin cukup
errorCorrectionLevel: 'M'  // Medium error correction
```

### ❌ Problem: PDF kosong/rusak
**Check:**
1. Pastikan `await` digunakan di routes
2. Pastikan `res.headersSent` check ada
3. Lihat console log error

---

## 📁 FILE YANG DIPERBAIKI

1. ✅ `server/controllers/pengajuanController.js`
   - Auto-generate nomor_surat saat insert
   - Async/await fix
   - Error handling lebih baik

2. ✅ `server/routes/pengajuanRoutes.js`
   - Simplified, delegate ke controller
   - Remove duplikasi kode

3. ✅ `server/utils/pdfGenerator.js`
   - QR Code positioning fix
   - Better logging
   - Larger QR size

4. ✅ `server/app.js`
   - Added jenis-surat route

5. ✅ `server/database/schema.sql` (NEW)
   - Complete database structure
   - Sample data

---

## 🎯 EXPECTED RESULT

Setelah fix, QR Code akan:
- ✅ Muncul di kiri bawah dokumen
- ✅ Ukuran 90x90 px (cukup besar)
- ✅ Bisa discan dengan HP
- ✅ Mengarah ke URL validasi
- ✅ Ada label "Scan untuk validasi"

## ⚠️ JIKA MASIH BERMASALAH

1. Screenshot PDF yang dihasilkan
2. Copy console log dari server
3. Copy console log dari browser (F12)
4. Share error message yang muncul
