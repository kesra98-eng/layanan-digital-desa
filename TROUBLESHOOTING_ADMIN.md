# 🔧 TROUBLESHOOTING ADMIN DASHBOARD

## ❌ ERROR: "Gagal mengambil data. Pastikan server sudah berjalan."

### **MASALAH YANG TERJADI:**

Saat akses `http://localhost:3000/admin.html`, muncul alert error:
```
❌ Gagal mengambil data. Pastikan server sudah berjalan.
```

---

### **PENYEBAB & SOLUSI:**

#### **1. Missing Database Import** ✅ FIXED

**Gejala:**
- Endpoint `/pengajuan/admin/list` tidak bisa query database
- Error 500 di console browser
- Server tidak crash tapi endpoint gagal

**Penyebab:**
File `server/routes/pengajuanRoutes.js` lupa import `db`

**BEFORE (❌):**
```javascript
const express = require("express");
const router = express.Router();
const { createPengajuan, getPengajuan, cetakPDF } = require("../controllers/pengajuanController");

// ... code menggunakan db.query() tapi db belum di-import!
router.get("/admin/list", async (req, res) => {
  const [rows] = await db.query(...) // ❌ ERROR: db is not defined
});
```

**AFTER (✅):**
```javascript
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // ✅ IMPORT DB
const { createPengajuan, getPengajuan, cetakPDF } = require("../controllers/pengajuanController");

router.get("/admin/list", async (req, res) => {
  const [rows] = await db.query(...) // ✅ WORKS!
});
```

**File yang Diperbaiki:**
- `server/routes/pengajuanRoutes.js` (Line 3)

---

### 🧪 **CARA TESTING SETELAH FIX:**

#### **Step 1: Restart Server**
```bash
# Stop server (Ctrl+C)
npm start
```

**Expected Output:**
```
🔥 Database terkoneksi (POOL AKTIF)
🔥 Server jalan di http://localhost:3000
```

#### **Step 2: Test Endpoint Langsung**

Buka browser atau gunakan curl/Postman:
```
http://localhost:3000/pengajuan/admin/list
```

**Expected Response (JSON):**
```json
[
  {
    "id": 1,
    "nama": "Budi Santoso",
    "nik": "3301123456789012",
    "alamat": "Jl. Mawar No. 12",
    "jenis_surat": "Surat Keterangan Usaha",
    "nomor_surat": "470/001/DS/III/2025",
    "tanggal": "2025-03-24T10:30:00.000Z",
    ...
  },
  ...
]
```

Jika response JSON → ✅ ENDPOINT BERHASIL!

#### **Step 3: Test Admin Dashboard**

1. Buka: `http://localhost:3000/admin.html`
2. Login dengan password: `admin123`
3. Dashboard harus muncul dengan data

**Checklist:**
- [ ] ✅ Password prompt muncul
- [ ] ✅ Setelah login, dashboard visible
- [ ] ✅ Statistik cards terisi (bukan 0 semua)
- [ ] ✅ Tabel menampilkan data
- [ ] ✅ Tidak ada alert error

#### **Step 4: Check Browser Console**

Tekan `F12` → Tab Console

**Normal Logs (✅):**
```
GET http://localhost:3000/pengajuan/admin/list 200 OK
```

**Error Logs (❌):**
```
GET http://localhost:3000/pengajuan/admin/list 500 Internal Server Error
```

---

## 🔍 TROUBLESHOOTING LAINNYA

### **Problem 2: Server Tidak Running**

**Gejala:**
- Browser loading terus
- Alert "Gagal mengambil data"
- Network tab: "(failed)" atau "pending"

**Solusi:**
```bash
# Cek apakah port 3000 sudah dipakai
netstat -ano | findstr :3000

# Jika tidak ada, start server
npm start

# Jika ada tapi macet, kill process
taskkill /PID <PID_NUMBER> /F
npm start
```

---

### **Problem 3: Database Tidak Terkoneksi**

**Gejala:**
Console server menampilkan:
```
❌ Database gagal: Cannot connect to database
```

**Solusi:**
1. ✅ Pastikan XAMPP MySQL running
2. ✅ Cek database `surat_desa` ada
3. ✅ Cek credentials di `server/config/db.js`

**Test Connection:**
```bash
mysql -u root -p
USE surat_desa;
SELECT * FROM pengajuan LIMIT 5;
```

---

### **Problem 4: CORS Error**

**Gejala:**
Browser console:
```
Access to fetch at 'http://localhost:3000/pengajuan/admin/list' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solusi:**
Cek file `server/app.js`:
```javascript
app.use(cors()); // ✅ Harus ada line ini
```

Jika tidak ada, tambahkan di bagian atas:
```javascript
const cors = require("cors");
// ...
app.use(cors());
```

---

### **Problem 5: Password Salah Terus**

**Gejala:**
Alert "Akses Ditolak" meskipun sudah masukkan `admin123`

**Solusi:**
1. Cek file `public/admin.html` line 165
2. Pastikan password benar:
```javascript
if (pass !== "admin123") {
```
3. Clear cache browser: `Ctrl + Shift + R`

---

### **Problem 6: Data Kosong di Tabel**

**Gejala:**
Dashboard muncul tapi tabel kosong
Statistik: 0 semua

**Solusi:**
1. ✅ Cek apakah ada data di database:
```sql
SELECT COUNT(*) FROM pengajuan;
```

2. ✅ Jika kosong, test input dari frontend:
   - Buka `http://localhost:3000`
   - Isi form → Submit
   - Data akan masuk

3. ✅ Klik tombol "🔄 Refresh Data" di dashboard

---

## 🛠️ DEBUGGING TOOLS

### **1. Test Endpoint dengan Fetch**

Buka browser console (F12), ketik:
```javascript
fetch('http://localhost:3000/pengajuan/admin/list')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**Jika sukses:**
```
[{ id: 1, nama: "Budi", ... }, ...]
```

**Jika error:**
```
Error: ... (lihat detail error)
```

---

### **2. Check Server Logs**

Lihat console tempat `npm start` running:

**Normal Flow:**
```
GET /pengajuan/admin/list 200 15ms
```

**Error Flow:**
```
GET /pengajuan/admin/list 500 5ms
Error: Cannot read property 'query' of undefined
```

---

### **3. Verify Database Structure**

```sql
-- Cek tabel ada
SHOW TABLES;

-- Cek struktur
DESCRIBE pengajuan;
DESCRIBE jenis_surat;

-- Cek data
SELECT p.*, j.nama AS jenis_surat 
FROM pengajuan p
JOIN jenis_surat j ON p.jenis_surat_id = j.id
ORDER BY p.tanggal DESC
LIMIT 5;
```

---

## 📋 CHECKLIST LENGKAP

### **Jika Admin Dashboard Error:**

- [ ] ✅ Server running (`npm start`)
- [ ] ✅ MySQL running di XAMPP
- [ ] ✅ Database `surat_desa` ada
- [ ] ✅ File `pengajuanRoutes.js` punya `require("../config/db")`
- [ ] ✅ Endpoint `/pengajuan/admin/list` return JSON
- [ ] ✅ Browser console tidak ada error CORS
- [ ] ✅ Password admin benar (`admin123`)
- [ ] ✅ Ada data di tabel `pengajuan`

---

## 🎯 PREVENTION

### **Agar Tidak Terjadi Lagi:**

1. ✅ **Selalu import dependencies** di setiap file routes
2. ✅ **Test endpoint** langsung sebelum pakai di frontend
3. ✅ **Check console logs** secara berkala
4. ✅ **Backup database** rutin
5. ✅ **Restart server** setelah edit code

---

## 📞 QUICK FIX GUIDE

### **Step-by-Step Fix:**

```bash
# 1. Stop server
# Ctrl+C

# 2. Edit file routes
notepad server/routes/pengajuanRoutes.js

# 3. Tambahkan line ini di atas (setelah line 2):
const db = require("../config/db");

# 4. Save file

# 5. Restart server
npm start

# 6. Test endpoint
# Buka: http://localhost:3000/pengajuan/admin/list

# 7. Test dashboard
# Buka: http://localhost:3000/admin.html
```

---

## ✅ VERIFIKASI FINAL

Setelah fix, seharusnya:

### **Server Console:**
```
🔥 Database terkoneksi (POOL AKTIF)
🔥 Server jalan di http://localhost:3000
```

### **Endpoint Test:**
```
GET http://localhost:3000/pengajuan/admin/list
Status: 200 OK
Response: [{...}, {...}, ...]
```

### **Admin Dashboard:**
```
Login: admin123 ✅
Statistics: Total Surat (15), Hari Ini (3), Jenis Banyak (Surat Usaha)
Table: Data ter-display dengan benar
Buttons: 🖨️ Cetak & 🗑️ Hapus berfungsi
```

---

## 🎉 STATUS

**Problem:** ✅ FIXED  
**Root Cause:** Missing `db` import in routes  
**Solution:** Added `const db = require("../config/db");`  
**Files Modified:** `server/routes/pengajuanRoutes.js`  

**Admin Dashboard sekarang berfungsi dengan baik!** 🚀

---

**Last Updated:** March 24, 2025  
**Version:** 1.1 (Admin Dashboard Hotfix)
