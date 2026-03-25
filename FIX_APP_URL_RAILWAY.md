# ✅ FIX FINAL - UPDATE APP_URL DI RAILWAY

## 🔥 MASALAH YANG DITEMUKAN

### **QR Code Masih Pakai Domain Lama** ❌

**Domain QR lama:**
```
https://layanan-digital-desa.up.railway.app  ❌ SALAH
```

**Domain yang benar:**
```
https://layanan-digital-desa-production.up.railway.app  ✅ BENAR
```

---

## 🎯 PENYEBAB

Di `pdfGenerator.js`:

```javascript
const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
```

👉 **APP_URL di Railway belum diset atau masih salah!**

---

## ✅ SOLUSI STEP-BY-STEP

### **STEP 1 — BUKA RAILWAY DASHBOARD**

1. Login ke https://railway.app
2. Pilih project `layanan-digital-desa`
3. Click service backend (bukan MySQL)

---

### **STEP 2 — BUKA TAB VARIABLES**

Click tab **"Variables"** di service backend kamu.

---

### **STEP 3 — ADD / UPDATE APP_URL**

Click **"New Variable"** atau edit yang sudah ada:

```
Variable: APP_URL
Value: https://layanan-digital-desa-production.up.railway.app
```

**PENTING:**
- ✅ HARUS pakai `-production`
- ✅ Tanpa spasi
- ✅ Huruf kecil semua
- ✅ Copy paste dari URL Railway kamu

---

### **STEP 4 — SAVE**

Click **"Add Variable"** atau **"Save"**

---

### **STEP 5 — REDEPLOY**

Ada 2 cara:

#### **Cara 1: Manual Redeploy di Railway**
1. Click tab **"Deployments"**
2. Click menu **"..."** (titik tiga)
3. Click **"Redeploy"**

#### **Cara 2: Git Push (Otomatis)**
```bash
git add .
git commit -m "fix: update APP_URL production"
git push
```

---

## ⏳ TUNGGU DEPLOYMENT

Railway akan deploy ulang otomatis (~2-3 menit).

**Status di Railway:**
```
Building... → Deploying... → Deployed ✅
```

---

## 🔥 STEP 6 — GENERATE PDF BARU (WAJIB!)

⚠️ **PENTING BANGET:**

**QR Code yang lama TIDAK AKAN BERUBAH!**

Harus generate PDF baru:

1. Buka admin dashboard
2. Buat pengajuan surat BARU
3. Cetak PDF

**ATAU:**

Jika mau test dengan data lama:
1. Hapus data lama
2. Buat baru lagi
3. Cetak PDF

---

## 🧪 STEP 7 — TEST QR CODE

### **Test 1: Check URL di QR**

1. Buka PDF yang BARU
2. Arahkan kamera HP ke QR code
3. **TAHAN** (jangan klik dulu)
4. Lihat preview URL

**HARUSNYA:**
```
https://layanan-digital-desa-production.up.railway.app/cek-surat/470-XXX-DS-III-YYYY
```

**BUKAN:**
```
https://layanan-digital-desa.up.railway.app/cek-surat/...  ❌
```

---

### **Test 2: Scan QR**

1. Click link QR atau scan dengan HP
2. Browser opens
3. Harus muncul validasi

**EXPECTED:**
```html
✅ SURAT TERVERIFIKASI

Dokumen ini terdaftar dalam sistem Desa Ambokulon

Nomor    : 470/XXX/DS/III/YYYY
Nama     : ...
Jenis    : ...
Tanggal  : ...
```

---

## 📊 CHECKLIST LENGKAP

```
[✅] APP_URL diset di Railway Variables
[✅] Value benar (pakai -production)
[✅] Redeploy dilakukan
[✅] Deployment selesai (tunggu 2-3 min)
[✅] PDF BARU digenerate
[✅] QR discan → URL benar
[✅] Validasi berhasil → 200 OK
```

---

## 🔍 TROUBLESHOOTING

### **Problem 1: QR masih domain lama**

**Cause:** PDF yang lama masih cached

**Solution:**
- Generate PDF BENAR-BENAR BARU
- Jangan pakai PDF lama
- Clear browser cache jika perlu

---

### **Problem 2: APP_URL tidak ter-save**

**Cause:** Railway error

**Solution:**
1. Refresh halaman
2. Add variable lagi
3. Save
4. Redeploy manual

---

### **Problem 3: Still 404 after fix**

**Possible causes:**

1. **Deployment belum selesai**
   - Tunggu 2-3 menit
   - Check Railway logs

2. **Data tidak ada di database**
   - Check SQL: `SELECT * FROM pengajuan WHERE nomor_surat LIKE '470%'`
   - Generate surat baru

3. **Format nomor beda**
   - QR: `470-003-DS-III-2026`
   - DB: `470/003/DS/III/2026`
   - Route harus convert: `replace(/-/g, "/")`

---

## 🎯 CARA CEK CEPAT DOMAIN

### **Method 1: Dari PDF**

Buka PDF → Lihat QR code URL:
```
https://LAYANAN-DIGITAL-DESA-PRODUCTION.up.railway.app  ✅
```

### **Method 2: Dari Railway**

Railway dashboard → Backend service → Settings → Domains:
```
layanan-digital-desa-production.up.railway.app
```

### **Method 3: Test Manual**

Browser test:
```
https://layanan-digital-desa-production.up.railway.app/jenis-surat
```

Jika muncul JSON → Domain benar ✅

---

## 📝 CONTOH VARIABLE LENGKAP

Di Railway Variables, HARUS ADA:

```env
# WAJIB - Domain Production
APP_URL = https://layanan-digital-desa-production.up.railway.app

# WAJIB - Database MySQL
MYSQLHOST = mysql.railway.internal
MYSQLUSER = root
MYSQLPASSWORD = <password-dari-Railway>
MYSQLDATABASE = railway
MYSQLPORT = 3306

# OPTIONAL - Port (Railway auto-set)
PORT = 8080
```

---

## 🎉 EXPECTED RESULT

Setelah fix ini:

### **✅ QR Code URL:**
```
https://layanan-digital-desa-production.up.railway.app/cek-surat/470-003-DS-III-2026
```

### **✅ Validation Page:**
```html
┌─────────────────────────────────────┐
│  ✅ SURAT TERVERIFIKASI             │
│                                     │
│  Dokumen ini terdaftar dalam sistem │
│  Desa Ambokulon                     │
│                                     │
│  Nomor    : 470/003/DS/III/2026     │
│  Nama     : Budi Santoso            │
│  Jenis    : Surat Keterangan Usaha  │
│  Tanggal  : 25 Maret 2026           │
└─────────────────────────────────────┘
```

### **✅ Railway Logs:**
```
🔍 QR scan: 470-003-DS-III-2026
🔄 Converted: 470/003/DS/III/2026
✅ Document found: 470/003/DS/III/2026
```

---

## 🚀 STATUS SETELAH FIX

```
✅ APP_URL: Set correctly
✅ QR Code: Uses production domain
✅ Validation: Working perfectly
✅ No more 404 errors
✅ Full system operational
```

---

## 💡 CATATAN PENTING

### **QR Code itu STATIC**

```diff
❌ QR lama = Domain lama (tidak berubah)
✅ QR baru = Domain baru (setelah update APP_URL)
```

**Makanya:**
- WAJIB generate PDF baru
- QR yang lama tidak bisa diubah

---

### **APP_URL Priority**

Di code:
```javascript
const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
```

**Priority:**
1. `APP_URL` environment variable (Railway) ← PRIORITAS
2. Fallback ke localhost (development)

**Jadi:**
- Di Railway: Set APP_URL
- Di lokal: Tidak perlu set, otomatis localhost

---

## 🎊 CONGRATULATIONS!

Setelah fix ini:

✅ **QR Code domain correct**  
✅ **Validation working**  
✅ **No more 404 errors**  
✅ **Production fully operational**  

**Status:** 🎊 **100% PRODUCTION READY!** 🎊

---

**Happy Fixing!** 🚀✨

*Last Updated: March 24, 2025*  
*Fix: APP_URL Configuration for Production*  
*Status: Critical - Requires Immediate Action*
