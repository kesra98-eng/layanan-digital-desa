# 🚀 QUICK DEPLOYMENT GUIDE - RAILWAY

## ⚡ STEP-BY-STEP (5 MENIT SELESAI!)

---

### **📋 CHECKLIST PERSIAPAN**

```bash
✅ .gitignore sudah dibuat
✅ railway.json sudah dibuat  
✅ db.js sudah production-ready
✅ pdfGenerator.js sudah auto-detect URL
✅ package.json lengkap
```

---

### **🔧 STEP 1: PUSH KE GITHUB (2 menit)**

Buka PowerShell di folder project:

```powershell
cd "e:\web desa\Layanan_Digital"
git init
git add .
git commit -m "Ready for Railway deployment"
```

**Lalu:**
1. Buka https://github.com/new
2. Nama repo: `layanan-digital-desa`
3. Create repository
4. Copy command yang muncul:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/layanan-digital-desa.git
git branch -M main
git push -u origin main
```

---

### **🗄️ STEP 2: BUAT MYSQL DI RAILWAY (1 menit)**

1. Login ke https://railway.app dengan GitHub
2. Klik **"New Project"**
3. Pilih **"Provision MySQL"**
4. Tunggu ~60 detik sampai database ready

**Copy credentials:**
- `MYSQLHOST`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQLPORT`

---

### **🚀 STEP 3: DEPLOY APP (2 menit)**

1. Di Railway dashboard, klik **"+"** → **"GitHub repo"**
2. Pilih repo `layanan-digital-desa`
3. Railway akan auto-detect dan build

**Set Environment Variables:**
Klik tab **"Variables"** → Add variables:
```
MYSQLHOST = <dari step 2>
MYSQLUSER = <dari step 2>
MYSQLPASSWORD = <dari step 2>
MYSQLDATABASE = surat_desa
MYSQLPORT = 3306
```

**Tunggu deploy selesai** (~2-3 menit)

---

### **🗄️ STEP 4: MIGRATE DATABASE (1 menit)**

Di Railway dashboard → MySQL service → **"Connect"**

Copy connection string, lalu run SQL:

```sql
CREATE TABLE IF NOT EXISTS jenis_surat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    template TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

INSERT INTO jenis_surat (nama, template) VALUES 
('Surat Keterangan Usaha', 'Template...'),
('Surat Keterangan Tidak Mampu', 'Template...'),
('Surat Pengantar KTP', 'Template...');
```

---

### ✅ **DONE! AKSES APLIKASI**

Railway akan generate URL:
```
https://your-app-production.up.railway.app
```

**Test:**
- Frontend: `https://your-app.up.railway.app`
- Admin: `https://your-app.up.railway.app/admin.html` (pass: admin123)

---

## 🎯 TROUBLESHOOTING CEPAT

### **Build Failed?**
```bash
# Check package.json
npm install
npm start
# Test locally dulu
```

### **Database Error?**
Check environment variables di Railway dashboard → Variables tab

### **QR Code masih localhost?**
Sudah fix otomatis detect production URL!

---

## 📞 BANTUAN LEBIH LANJUT

Jika ada masalah, baca panduan lengkap di:
`DEPLOY_RAILWAY_GUIDE.md`

---

**Happy Deploying!** 🚀✨
