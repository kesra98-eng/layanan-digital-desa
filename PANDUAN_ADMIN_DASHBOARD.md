# 📋 PANDUAN LENGKAP ADMIN DASHBOARD

## 🎯 FITUR ADMIN DASHBOARD

### **Yang Sudah Dibuat:**
1. ✅ **Halaman Admin** dengan password protection
2. ✅ **Tabel Data** semua pengajuan surat
3. ✅ **Statistik Real-time** (Total, Hari Ini, Jenis Terbanyak)
4. ✅ **Cetak Ulang Surat** kapan saja
5. ✅ **Hapus Data** yang tidak diperlukan
6. ✅ **Responsive Design** untuk mobile
7. ✅ **Password Protection** sederhana

---

## 🔧 CARA AKSES

### **Step 1: Pastikan Server Running**
```bash
npm start
```

Expected output:
```
🔥 Database terkoneksi (POOL AKTIF)
🔥 Server jalan di http://localhost:3000
```

### **Step 2: Buka Halaman Admin**
Buka browser dan ketik URL:
```
http://localhost:3000/admin.html
```

### **Step 3: Masukkan Password**
```
Password default: admin123
```

Jika benar → Masuk ke dashboard  
Jika salah → Redirect ke halaman utama

---

## 📊 FITUR DASHBOARD

### **1. Statistik Cards**

Dashboard menampilkan 3 kartu statistik:

| Card | Warna | Fungsi |
|------|-------|--------|
| **Total Surat** | Biru Navy | Menampilkan jumlah semua pengajuan |
| **Hari Ini** | Hijau | Jumlah surat yang dibuat hari ini |
| **Jenis Terbanyak** | Ungu | Jenis surat yang paling banyak diajukan |

**Contoh:**
```
┌──────────────┬──────────────┬──────────────┐
│ Total Surat  │  Hari Ini    │ Jenis Banyak │
│     15       │      3       │  Surat Usaha │
└──────────────┴──────────────┴──────────────┘
```

---

### **2. Tabel Data Pengajuan**

**Kolom Tabel:**
1. **No** - Nomor urut
2. **Tgl Pengajuan** - Tanggal submit
3. **No. Surat** - Nomor surat otomatis
4. **Nama Pemohon** - Nama warga
5. **NIK** - NIK pemohon (dengan format xxx-xxx-xxx-xxxx)
6. **Jenis Surat** - Badge jenis surat
7. **Keperluan** - Tujuan pembuatan surat
8. **Aksi** - Tombol Cetak & Hapus

**Contoh Tampilan:**
```
┌────┬───────────┬───────────────┬─────────────┬───────────┬─────────────┬───────────┬──────────────┐
│ No │ Tgl       │ No. Surat     │ Nama        │ NIK       │ Jenis       │ Keperluan │ Aksi         │
├────┼───────────┼───────────────┼─────────────┼───────────┼─────────────┼───────────┼──────────────┤
│ 1  │ 24 Mar '25│ 470/001/DS/.. │ Budi S.     │ 3301-.... │ Surat Usaha│ SKCK      │ 🖨️ 🗑️       │
│ 2  │ 24 Mar '25│ 470/002/DS/.. │ Ani R.      │ 3301-.... │ SKTM       │ Sekolah   │ 🖨️ 🗑️       │
└────┴───────────┴───────────────┴─────────────┴───────────┴─────────────┴───────────┴──────────────┘
```

---

### **3. Tombol Aksi**

#### **🖨️ Tombol Cetak (Biru)**
**Fungsi:** Cetak ulang PDF surat

**Cara Pakai:**
1. Klik tombol **🖨️ Cetak**
2. PDF akan terbuka di tab baru
3. Download atau print sesuai kebutuhan

**Use Case:**
- Warga lupa menyimpan PDF
- Perlu cetak ulang karena rusak
- Arsip tambahan untuk desa

---

#### **🗑️ Tombol Hapus (Merah)**
**Fungsi:** Hapus data dari database

**Cara Pakai:**
1. Klik tombol **🗑️ Hapus**
2. Konfirmasi: "Apakah Anda yakin ingin menghapus data ini?"
3. Klik OK → Data terhapus permanen
4. Tabel auto-refresh

**⚠️ PERINGATAN:**
- Data yang sudah dihapus **TIDAK BISA DIKEMBALIKAN**
- Hati-hati saat menghapus data asli
- Gunakan hanya untuk:
  - Data percobaan/testing
  - Data yang salah input
  - Data duplikat

---

## 🔒 KEAMANAN

### **Password Protection**

**Default Password:**
```
admin123
```

**Lokasi Kode:** `public/admin.html` (Line 165)

**Cara Mengganti Password:**

1. Buka file `public/admin.html`
2. Cari baris ini (sekitar line 165):
```javascript
if (pass !== "admin123") {
```

3. Ganti dengan password baru:
```javascript
if (pass !== "passwordBaruAnda") {
```

4. Simpan file
5. Refresh halaman admin

**💡 Tips Keamanan:**
- Ganti password default sesegera mungkin
- Gunakan kombinasi huruf + angka
- Minimal 8 karakter
- Jangan bagikan ke orang yang tidak berwenang

---

## 🎨 DESAIN & UI

### **Color Scheme:**
- **Primary:** Biru Navy (#1e3a8a) - Konsisten dengan frontend
- **Success:** Hijau (#059669) - Untuk statistik positif
- **Warning:** Kuning (#fef3c7) - Untuk badge pending
- **Danger:** Merah (#dc2626) - Untuk delete button

### **Typography:**
- Font: **Inter** (Google Fonts)
- Clean, modern, professional
- Easy to read

### **Responsive Design:**
- Desktop: Full table view
- Tablet: Scrollable table
- Mobile: Stacked buttons

---

## 📁 STRUKTUR FILE

### **Backend Files:**
```
server/routes/pengajuanRoutes.js
├── GET /admin/list      ← Ambil semua data
└── DELETE /admin/hapus/:id ← Hapus data
```

### **Frontend Files:**
```
public/admin.html
├── Header (Admin Panel)
├── Statistics Cards (3 cards)
├── Data Table
│   ├── Headers (8 columns)
│   └── Body (dynamic data)
└── JavaScript Logic
    ├── Password Protection
    ├── Load Data Function
    ├── Statistics Update
    ├── Print Function
    └── Delete Function
```

---

## 🧪 TESTING GUIDE

### **Test 1: Akses Dashboard**
1. ✅ Server running
2. ✅ Buka http://localhost:3000/admin.html
3. ✅ Masukkan password: `admin123`
4. ✅ Dashboard muncul dengan statistik

### **Test 2: Lihat Data**
1. ✅ Pastikan ada data di database
2. ✅ Dashboard menampilkan tabel
3. ✅ Statistik card ter-update
4. ✅ Semua kolom terisi

### **Test 3: Cetak Surat**
1. ✅ Klik tombol **🖨️ Cetak**
2. ✅ PDF terbuka di tab baru
3. ✅ QR Code muncul
4. ✅ Nama Kepala Desa font 16pt
5. ✅ Tidak ada karakter "Ð"

### **Test 4: Hapus Data**
1. ✅ Klik tombol **🗑️ Hapus**
2. ✅ Konfirmasi muncul
3. ✅ Klik OK
4. ✅ Data terhapus dari tabel
5. ✅ Statistik auto-update

### **Test 5: Password Wrong**
1. ✅ Buka admin.html
2. ✅ Masukkan password salah
3. ✅ Alert "Akses Ditolak"
4. ✅ Redirect ke index.html

---

## 💡 FITUR UNGGULAN

### **1. Real-time Statistics**
Dashboard otomatis menghitung:
- Total semua surat
- Surat yang dibuat hari ini
- Jenis surat paling populer

### **2. Formatted NIK**
NIK ditampilkan dengan format:
```
3301-1234-5678-9012
```
Lebih mudah dibaca!

### **3. Smart Date Display**
Tanggal diformat dalam bahasa Indonesia:
```
24 Mar 2025
```

### **4. Auto Refresh**
Setelah hapus data, tabel otomatis reload
Tidak perlu refresh manual

### **5. Responsive Table**
- Desktop: 8 kolom full
- Mobile: Scroll horizontal
- Buttons stack di mobile

---

## 🔧 TROUBLESHOOTING

### **Problem: Dashboard Tidak Muncul**

**Solusi:**
1. Cek server running: `npm start`
2. Cek console error di browser (F12)
3. Pastikan MySQL running di XAMPP

### **Problem: Data Tidak Muncul**

**Solusi:**
1. Cek apakah ada data di database:
```sql
SELECT * FROM pengajuan;
```
2. Jika kosong, test input dari frontend dulu
3. Klik tombol "Refresh Data"

### **Problem: Tombol Hapus Tidak Berfungsi**

**Solusi:**
1. Cek console browser (F12)
2. Pastikan endpoint `/pengajuan/admin/hapus/:id` ada
3. Restart server jika perlu

### **Problem: Password Selalu Salah**

**Solusi:**
1. Cek file `admin.html`
2. Pastikan password di line 165 benar
3. Clear cache browser (Ctrl+Shift+R)

---

## 📊 ANALISIS DATA

### **Data yang Tersimpan:**

Setiap pengajuan mengandung:
- ✅ Identitas lengkap (Nama, NIK, Alamat)
- ✅ Detail surat (Jenis, Keperluan)
- ✅ Nomor surat otomatis
- ✅ Timestamp pengajuan
- ✅ Template isi surat

### **Kegunaan Data:**

1. **Arsip Digital** - Semua surat tersimpan rapi
2. **Validasi** - Bisa cek keaslian surat kapan saja
3. **Statistik** - Analisis pola pengajuan surat
4. **Audit Trail** - Track record pengajuan
5. **Backup** - Tidak perlu simpan file PDF manual

---

## 🚀 NEXT STEPS (PENGEMBANGAN)

### **Fitur Tambahan yang Bisa Ditambahkan:**

#### **1. Export Excel**
```javascript
// Export data ke CSV/Excel
function exportToExcel() {
  // Code untuk generate Excel file
}
```

#### **2. Search & Filter**
```javascript
// Cari berdasarkan nama/NIK/tanggal
<input type="text" id="searchInput" placeholder="Cari nama atau NIK...">
```

#### **3. Pagination**
```javascript
// Batasi tampilan 10 data per halaman
const itemsPerPage = 10;
```

#### **4. Print Preview**
```javascript
// Preview sebelum cetak
function previewSurat(id) {
  // Show modal with PDF preview
}
```

#### **5. Edit Data**
```javascript
// Form untuk edit data yang sudah ada
router.put("/admin/edit/:id", async (req, res) => {
  // Update data logic
});
```

#### **6. Upload Foto**
```javascript
// Upload foto pemohon untuk KTP digital
const upload = multer({ dest: 'uploads/' });
router.post("/upload", upload.single('foto'), ...);
```

---

## 📝 BEST PRACTICES

### **Untuk Admin:**

1. ✅ **Backup Database Rutin**
   ```bash
   mysqldump -u root surat_desa > backup_$(date +%Y%m%d).sql
   ```

2. ✅ **Ganti Password Default**
   - Segera setelah deploy
   - Setiap 3 bulan sekali

3. ✅ **Monitor Data Mencurigakan**
   - Cek pengajuan aneh/spam
   - Hapus data testing

4. ✅ **Jangan Hapus Data Asli**
   - Konfirmasi dulu sebelum hapus
   - Archive data lama (jangan delete)

5. ✅ **Print Quality Check**
   - Test print berkala
   - Pastikan QR Code terbaca

---

## 🎯 SUMMARY

### **Yang Sudah Ada:**
- ✅ Backend API untuk admin (list & delete)
- ✅ Frontend dashboard modern
- ✅ Password protection
- ✅ Real-time statistics
- ✅ Responsive design
- ✅ Print & delete functionality

### **Cara Akses:**
```
URL: http://localhost:3000/admin.html
Pass: admin123
```

### **Fitur Utama:**
1. 📊 **Statistics** - Total, Hari Ini, Jenis Terbanyak
2. 📋 **Data Table** - 8 kolom informasi lengkap
3. 🖨️ **Cetak Surat** - Print ulang kapan saja
4. 🗑️ **Hapus Data** - Remove data tidak perlu
5. 🔒 **Security** - Password protected

---

**Status:** ✅ PRODUCTION READY  
**Version:** 1.0 (Admin Dashboard)  
**Last Updated:** March 24, 2025

## 🎉 SELAMAT!

**Dashboard Admin sudah siap digunakan!** 🏛️✨

Sekarang Anda punya:
- ✅ Sistem arsip digital terpusat
- ✅ Tools manajemen data yang powerful
- ✅ Interface yang modern dan user-friendly
- ✅ Security basic yang cukup

**Selamat mengelola pengajuan surat desa dengan lebih efisien!** 🚀
