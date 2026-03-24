# 🏗️ BLUEPRINT STRUKTUR WEB APLIKASI
## **Layanan Digital Desa Ambokulon**

---

## 📊 ARSITEKTUR SISTEM

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   index.html │  │  script.js   │  │  style.css   │      │
│  │   (Frontend) │  │   (Logic)    │  │   (Style)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                 SERVER (Node.js + Express)                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  app.js (Main Server - Port 3000)                 │    │
│  │  - CORS Middleware                                │    │
│  │  - Static Files                                   │    │
│  │  - Route Handler                                  │    │
│  │  - QR Validation Endpoint                         │    │
│  └────────────────────────────────────────────────────┘    │
│         ↙                    ↘                              │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │ /pengajuan      │    │ /jenis-surat    │               │
│  │ Routes          │    │ Routes          │               │
│  └─────────────────┘    └─────────────────┘               │
│         ↙                    ↘                              │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │ Controllers     │    │ Utils           │               │
│  │ - Create        │    │ - PDF Generator │               │
│  │ - Get All       │    │ - Template Eng. │               │
│  │ - Cetak PDF     │    │ - Nomor Surat   │               │
│  └─────────────────┘    └─────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            ↕ MySQL Connection
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (MySQL - surat_desa)                  │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │ jenis_surat      │      │ pengajuan        │            │
│  │ - id             │◄─────│ - id             │            │
│  │ - nama           │  FK  │ - nama           │            │
│  │ - template       │      │ - nik            │            │
│  │ - created_at     │      │ - alamat         │            │
│  └──────────────────┘      │ - keperluan      │            │
│                            │ - jenis_surat_id │            │
│                            │ - nomor_surat    │            │
│                            │ - status         │            │
│                            │ - tanggal        │            │
│                            └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 STRUKTUR FILE LENGKAP

```
Layanan_Digital/
│
├── public/                          # FRONTEND (Client-side)
│   ├── index.html                   # Halaman utama form pengajuan
│   ├── script.js                    # JavaScript logic frontend
│   └── style.css                    # Styling halaman
│
├── server/                          # BACKEND (Server-side)
│   ├── assets/
│   │   └── logo.png                 # Logo desa untuk kop surat
│   │
│   ├── config/
│   │   └── db.js                    # Konfigurasi database MySQL
│   │
│   ├── controllers/                 # Business Logic Layer
│   │   ├── jenisSuratController.js  # Handle request jenis_surat
│   │   └── pengajuanController.js   # Handle request pengajuan
│   │
│   ├── routes/                      # Routing Layer (API Endpoints)
│   │   ├── jenisSuratRoutes.js      # Routes untuk jenis_surat
│   │   └── pengajuanRoutes.js       # Routes untuk pengajuan
│   │
│   ├── utils/                       # Helper Functions
│   │   ├── nomorSurat.js            # Generate nomor surat otomatis
│   │   ├── pdfGenerator.js          # Generate PDF dengan QR Code ⭐
│   │   └── templateEngine.js        # Render template surat dinamis
│   │
│   ├── database/                    # Database Scripts (NEW)
│   │   └── schema.sql               # Struktur DB + sample data
│   │
│   └── app.js                       # Main server entry point
│
├── DEBUG_QR_CODE.md                 # Panduan debugging QR Code
├── package.json                     # Dependencies Node.js
└── README.md                        # Dokumentasi proyek
```

---

## 🔄 FLOW APLIKASI (STEP BY STEP)

### 1️⃣ USER MENGISI FORM (Frontend)
```
User membuka http://localhost:3000
         ↓
Load form & dropdown jenis surat dari API
         ↓
User isi: Nama, NIK, Alamat, Keperluan, Jenis Surat
         ↓
Submit form → POST /pengajuan
```

### 2️⃣ SERVER MENERIMA DATA (Backend)
```
Controller terima data
         ↓
Generate nomor_surat otomatis (format: 470/001/DS/III/2025)
         ↓
INSERT INTO pengajuan (dengan nomor_surat)
         ↓
Return { id, nomor_surat } ke frontend
```

### 3️⃣ USER CETAK PDF
```
User klik "Cetak Surat"
         ↓
GET /pengajuan/:id/cetak
         ↓
Controller query data + join jenis_surat
         ↓
Call generatePDF(res, data) ← Async!
         ↓
┌─────────────────────────────────────┐
│ PDF GENERATION PROCESS:             │
│ 1. Setup PDFKit document            │
│ 2. Draw Kop Surat + Logo            │
│ 3. Draw Judul & Nomor Surat         │
│ 4. Draw Data Pemohon                │
│ 5. Render Template Isi Surat        │
│ 6. Generate QR Code (async) ⭐      │
│    - URL: /cek-surat/{nomor_surat}  │
│    - QRCode.toDataURL()             │
│    - doc.image(qrImage, x, y)       │
│ 7. Draw Tanda Tangan                │
│ 8. Send PDF to browser              │
└─────────────────────────────────────┘
         ↓
PDF terbuka di browser user
```

### 4️⃣ QR CODE SCAN (Validasi)
```
Scan QR Code dengan HP
         ↓
Buka URL: http://localhost:3000/cek-surat/470-001-DS-III-2025
         ↓
Server cari data berdasarkan nomor_surat
         ↓
Jika ada → Tampilkan halaman validasi ✅
Jika tidak → 404 ❌
```

---

## 🛠️ TEKNOLOGI YANG DIGUNAKAN

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Node.js | Latest | Runtime Environment |
| Express.js | ^5.2.1 | Web Framework |
| MySQL2 | ^3.20.0 | Database Driver |
| PDFKit | ^0.18.0 | PDF Generation |
| QRCode | ^1.5.4 | QR Code Generator |
| CORS | ^2.8.6 | Cross-Origin Resource Sharing |

### Frontend
| Teknologi | Fungsi |
|-----------|--------|
| HTML5 | Structure |
| CSS3 | Styling |
| Vanilla JavaScript | Logic & API Calls |

### Database
| Komponen | Deskripsi |
|----------|-----------|
| MySQL | Relational Database |
| utf8mb4 | Character Set (support emoji & karakter khusus) |
| InnoDB | Storage Engine |

---

## 🔑 FITUR UTAMA

### ✅ Pengajuan Surat Online
- Form digital untuk input data warga
- Validasi field wajib
- Auto-generate nomor surat

### ✅ PDF Generation Otomatis
- Template dinamis sesuai jenis surat
- Kop surat resmi desa
- QR Code untuk validasi
- Format A4 standar

### ✅ QR Code Validation System
- Setiap surat punya QR unik
- Scan untuk verifikasi keaslian
- Halaman validasi sederhana

### ✅ Multi Jenis Surat
- Surat Keterangan Usaha
- Surat Keterangan Tidak Mampu
- Surat Pengantar KTP
- Template fleksibel per jenis

---

## 🔍 DETAIL TEKNIS QR CODE SYSTEM

### Lokasi dalam Kode
**File:** `server/utils/pdfGenerator.js` (Line 92-102)

### Proses Generate QR
```javascript
// 1. Buat URL validasi
const urlValidasi = `http://localhost:3000/cek-surat/${nomor_surat}`;

// 2. Generate QR Code sebagai DataURL
const qrImage = await QRCode.toDataURL(urlValidasi, {
  width: 120,              // Ukuran lebar QR (px)
  margin: 2,               // Margin putih sekitar QR
  errorCorrectionLevel: 'M' // Medium error correction
});

// 3. Tempel QR ke PDF
doc.image(qrImage, 60, qrY, { width: 90 });

// 4. Tambah label
doc.fontSize(7).text("Scan untuk validasi", 55, qrY + 95);
```

### Posisi QR di PDF
```
┌─────────────────────────────────────┐
│         KOP SURAT                   │
│         JUDUL                       │
│                                     │
│         ISI SURAT                   │
│         (Template)                  │
│                                     │
│    [QR]        Tanda Tangan         │
│   90x90        Kepala Desa          │
│              (MUKSININ)             │
└─────────────────────────────────────┘
```

### Keamanan QR Code
- URL menggunakan format khusus (slash diganti dash)
- Validasi real-time ke database
- Tidak bisa dipalsukan (harus ada di DB)

---

## 📊 DATABASE SCHEMA

### Tabel: `jenis_surat`
| Column | Type | Constraint | Deskripsi |
|--------|------|------------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID jenis surat |
| nama | VARCHAR(255) | NOT NULL | Nama jenis surat |
| template | TEXT | NOT NULL | Template isi surat (pakai {{variable}}) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu dibuat |

### Tabel: `pengajuan`
| Column | Type | Constraint | Deskripsi |
|--------|------|------------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID pengajuan |
| nama | VARCHAR(255) | NOT NULL | Nama pemohon |
| nik | VARCHAR(16) | NOT NULL | NIK pemohon |
| alamat | TEXT | NOT NULL | Alamat pemohon |
| keperluan | VARCHAR(255) | NULL | Keperluan pembuatan surat |
| jenis_surat_id | INT | FOREIGN KEY → jenis_surat.id | Jenis surat |
| nomor_surat | VARCHAR(100) | NULL | Nomor surat (generated) |
| status | ENUM | DEFAULT 'pending' | Status persetujuan |
| tanggal | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal pengajuan |

---

## 🚀 CARA MENJALANKAN

### 1. Prerequisites
```bash
# Install Node.js
# Install XAMPP/MySQL
```

### 2. Setup Database
```bash
# Buka phpMyAdmin atau MySQL CLI
mysql -u root -p

# Jalankan schema
source e:\web desa\Layanan_Digital\server\database\schema.sql
```

### 3. Install Dependencies
```bash
cd e:\web desa\Layanan_Digital
npm install
```

### 4. Run Server
```bash
npm start

# Output:
# 🔥 Database terkoneksi (POOL AKTIF)
# 🔥 Server jalan di http://localhost:3000
```

### 5. Akses Aplikasi
```
Frontend: http://localhost:3000
API: http://localhost:3000/pengajuan
QR Validasi: http://localhost:3000/cek-surat/{nomor}
```

---

## 🎯 TESTING CHECKLIST

### Test Input Data
- [ ] Form tampil dengan benar
- [ ] Dropdown jenis surat terisi
- [ ] Submit berhasil
- [ ] Response berisi id dan nomor_surat

### Test Cetak PDF
- [ ] PDF terbuka di tab baru
- [ ] Kop surat lengkap
- [ ] Data pemohon benar
- [ ] **QR Code muncul di kiri bawah** ⭐
- [ ] QR bisa discan
- [ ] URL validasi bisa diakses

### Test Validasi QR
- [ ] Scan QR dengan HP
- [ ] Browser buka halaman validasi
- [ ] Data surat tampil
- [ ] Status "TERVERIFIKASI"

---

## 📞 SUPPORT & DEBUGGING

Jika ada masalah, baca: **DEBUG_QR_CODE.md**

### Log yang Harus Dicek
**Server Console:**
```
✅ Generating PDF untuk: 470/001/DS/III/2025
✅ Generating QR for URL: http://localhost:3000/cek-surat/470-001-DS-III-2025
✅ QR generated successfully, placing at: { x: 60, y: 165 }
✅ QR placed successfully
```

**Browser Console (F12):**
- Network tab → Status 200 OK
- No CORS errors
- No JavaScript errors

---

**Version:** 1.0  
**Last Updated:** March 24, 2025  
**Author:** AI Assistant
