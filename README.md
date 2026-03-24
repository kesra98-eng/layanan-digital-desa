# 🏛️ Layanan Digital Desa Ambokulon

Sistem pengajuan surat online untuk warga desa dengan QR Code validation.

## 🚀 Fitur Utama

- ✅ **Pengajuan Surat Online** - Form digital untuk berbagai jenis surat
- ✅ **PDF Generation Otomatis** - Cetak surat dengan kop resmi desa
- ✅ **QR Code Validation** - Setiap surat punya QR code unik untuk validasi
- ✅ **Multi Jenis Surat** - Template fleksibel sesuai kebutuhan
- ✅ **Real-time Verification** - Scan QR untuk cek keaslian surat

## 📋 Prerequisites

- Node.js (versi 14 atau lebih baru)
- MySQL / MariaDB (XAMPP recommended)
- Web browser modern

## 🛠️ Instalasi

### 1. Clone/Download Project
```bash
cd e:\web desa\Layanan_Digital
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

**Opsi A: Menggunakan phpMyAdmin**
1. Buka http://localhost/phpmyadmin
2. Buat database `surat_desa`
3. Import file `server/database/schema.sql`
4. Jalankan `server/database/fix_data.sql` untuk fix data lama

**Opsi B: Menggunakan MySQL CLI**
```bash
mysql -u root -p
source e:\web desa\Layanan_Digital\server\database\schema.sql
source e:\web desa\Layanan_Digital\server\database\fix_data.sql
```

### 4. Konfigurasi Database

Edit file `server/config/db.js` jika perlu:
```javascript
host: "127.0.0.1",
user: "root",
password: "",  // Sesuaikan dengan password MySQL Anda
database: "surat_desa",
```

### 5. Jalankan Server
```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

## 📖 Cara Menggunakan

### Untuk Warga (Frontend)

1. Buka http://localhost:3000
2. Pilih jenis surat yang diinginkan
3. Isi form dengan data lengkap:
   - Nama Lengkap
   - NIK (16 digit)
   - Alamat
   - Keperluan
4. Klik **"Kirim Pengajuan"**
5. Setelah berhasil, klik **"🖨️ Cetak Surat"**
6. PDF akan terbuka otomatis
7. Download/print surat

### Validasi QR Code

1. Scan QR code di surat menggunakan smartphone
2. Browser akan membuka halaman validasi
3. Jika surat valid → tampil data lengkap
4. Jika tidak valid → tampil pesan error

## 🔧 Troubleshooting

### QR Code Tidak Muncul di PDF

**Penyebab:** Data lama tidak punya nomor_surat

**Solusi:**
```sql
-- Jalankan di phpMyAdmin atau MySQL
UPDATE pengajuan 
SET nomor_surat = CONCAT('470/', LPAD(id, 3, '0'), '/DS/III/2025')
WHERE nomor_surat IS NULL OR nomor_surat = '';
```

Atau jalankan file: `server/database/fix_data.sql`

### Server Tidak Bisa Start

**Cek:**
1. MySQL sudah running (XAMPP)
2. Database `surat_desa` sudah dibuat
3. Port 3000 tidak dipakai aplikasi lain

**Solusi:**
```bash
# Cek port
netstat -ano | findstr :3000

# Kill process jika perlu
taskkill /PID <PID_NUMBER> /F
```

### Error: "Cannot find module"

**Solusi:**
```bash
# Re-install dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

## 📁 Struktur Project

```
Layanan_Digital/
├── public/                 # Frontend files
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server/                 # Backend files
│   ├── config/            # Database config
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   │   ├── pdfGenerator.js    # Generate PDF + QR
│   │   ├── templateEngine.js  # Render template
│   │   └── nomorSurat.js      # Generate nomor surat
│   └── app.js             # Main server
├── DEBUG_QR_CODE.md        # Panduan debug QR
└── BLUEPRINT_STRUKTUR.md   # Blueprint lengkap sistem
```

## 🗄️ Database Schema

### Tabel: `jenis_surat`
- id (INT, PRIMARY KEY)
- nama (VARCHAR) - Nama jenis surat
- template (TEXT) - Template isi surat
- created_at (TIMESTAMP)

### Tabel: `pengajuan`
- id (INT, PRIMARY KEY)
- nama (VARCHAR) - Nama pemohon
- nik (VARCHAR) - NIK pemohon
- alamat (TEXT) - Alamat
- keperluan (VARCHAR) - Keperluan
- jenis_surat_id (INT, FK) - Jenis surat
- nomor_surat (VARCHAR) - Nomor surat (auto-generate)
- status (ENUM) - Status persetujuan
- tanggal (TIMESTAMP)

## 🔌 API Endpoints

### Frontend Routes
- `GET /` - Halaman form pengajuan
- `GET /jenis-surat` - List jenis surat

### API Endpoints
- `POST /pengajuan` - Submit pengajuan baru
- `GET /pengajuan` - Get semua pengajuan
- `GET /pengajuan/:id/cetak` - Cetak PDF surat
- `GET /cek-surat/:nomor` - Validasi QR code

## 🧪 Testing

### Test Input Data
```bash
curl -X POST http://localhost:3000/pengajuan \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Test User",
    "nik": "1234567890123456",
    "alamat": "Jl. Test No. 1",
    "keperluan": "Testing",
    "jenis_surat_id": 1
  }'
```

### Test Cetak PDF
```bash
curl http://localhost:3000/pengajuan/1/cetak --output surat.pdf
```

### Test Validasi QR
```bash
curl http://localhost:3000/cek-surat/470-001-DS-III-2025
```

## 📊 Flow Diagram

```
User → Form → POST /pengajuan → Generate Nomor Surat → Save to DB
                                                      ↓
User ← PDF with QR ← Generate PDF ← GET /:id/cetak ←
     ↓
Scan QR
     ↓
GET /cek-surat/:nomor → Query DB → Show Validation Page
```

## 🛡️ Keamanan

- QR Code menggunakan format khusus (slash diganti dash)
- Validasi real-time ke database
- SQL Injection protection (prepared statements)
- CORS enabled untuk frontend terpisah

## 📝 Template Surat

Template menggunakan variable syntax `{{variable}}`:

```
Yang bertanda tangan di bawah ini menerangkan bahwa:
Nama: {{nama}}
NIK: {{nik}}
Alamat: {{alamat}}

... (isi surat lainnya)
```

Variable yang tersedia:
- `{{nama}}` - Nama pemohon
- `{{nik}}` - NIK pemohon
- `{{alamat}}` - Alamat pemohon
- `{{keperluan}}` - Keperluan
- `{{nomor_surat}}` - Nomor surat
- `{{jenis_surat}}` - Jenis surat
- `{{tanggal_ttd}}` - Tanggal tanda tangan

## 🤝 Kontribusi

Untuk kontribusi, silakan fork dan pull request.

## 📄 License

Project ini open source untuk keperluan pembelajaran dan pengembangan desa.

## 👥 Credits

- Pemerintah Desa Ambokulon
- Developer & Contributors

## 📞 Support

Untuk bantuan atau pertanyaan:
- Baca: `DEBUG_QR_CODE.md` untuk troubleshooting QR Code
- Baca: `BLUEPRINT_STRUKTUR.md` untuk blueprint lengkap sistem
- Check issue tracker GitHub

---

**Version:** 1.0  
**Last Updated:** March 24, 2025