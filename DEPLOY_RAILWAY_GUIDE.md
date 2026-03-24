# 🚀 PANDUAN DEPLOY KE RAILWAY

## 📋 PERSIAPAN SEBELUM DEPLOY

### **Yang Dibutuhkan:**
1. ✅ GitHub account
2. ✅ Railway account (daftar dengan GitHub)
3. ✅ Database MySQL (akan kita buat di Railway)
4. ✅ File project sudah siap

---

## 🔧 STEP 1: PERSIAPAN FILE PROJECT

### **A. Buat file `.gitignore`**

File ini penting agar `node_modules` tidak ter-upload:

```bash
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Database (jika ada file .db)
*.db
*.sqlite

# Uploads (jika ada fitur upload)
uploads/
public/uploads/
```

**Lokasi:** `e:\web desa\Layanan_Digital\.gitignore`

---

### **B. Update `package.json` untuk Production**

Pastikan `package.json` punya scripts yang benar:

```json
{
  "name": "layanan_digital",
  "version": "1.0.0",
  "description": "Aplikasi pengajuan surat desa",
  "main": "server/app.js",
  "scripts": {
    "start": "node server/app.js",
    "dev": "nodemon server/app.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "mysql2": "^3.20.0",
    "pdfkit": "^0.18.0",
    "qrcode": "^1.5.4"
  }
}
```

**Check:** Pastikan ada `"main": "server/app.js"` dan `"start": "node server/app.js"`

---

### **C. Buat file `railway.json` (Optional tapi Recommended)**

File konfigurasi khusus Railway:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Lokasi:** `e:\web desa\Layanan_Digital\railway.json`

---

## 🗄️ STEP 2: SETUP DATABASE DI RAILWAY

### **A. Buat MySQL Database di Railway**

1. Login ke [Railway](https://railway.app/)
2. Klik **"New Project"**
3. Pilih **"Provision MySQL"**
4. Tunggu database selesai dibuat (~2 menit)

### **B. Dapatkan Connection String**

Setelah database jadi, Railway akan menampilkan:
- `MYSQLHOST`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQLPORT`

**Copy semua credentials ini!** Kita butuh di Step 3.

---

## 🔐 STEP 3: UPDATE DATABASE CONFIG

### **Update `server/config/db.js` untuk Support Environment Variables**

Ganti config hardcode dengan environment variables:

```javascript
const mysql = require("mysql2");

// =========================
// 🔥 CONFIG DATABASE (PRODUCTION READY)
// =========================
const db = mysql.createPool({
  // Gunakan environment variable jika ada (production)
  // Jika tidak ada, gunakan localhost (development)
  host: process.env.MYSQLHOST || "127.0.0.1",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "surat_desa",
  port: process.env.MYSQLPORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  charset: "utf8mb4",
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully!");
    connection.query("SET NAMES utf8mb4");
    connection.query("SET CHARACTER SET utf8mb4");
    connection.release();
  }
});

db.on("error", (err) => {
  console.error("❌ Database error:", err.message);
});

module.exports = db.promise();
```

**PENTING:** Config sekarang otomatis detect environment Railway!

---

## 📦 STEP 4: UPLOAD KE GITHUB

### **A. Initialize Git Repository**

Buka terminal di folder project:

```bash
cd "e:\web desa\Layanan_Digital"
git init
git add .
git commit -m "Initial commit - Layanan Digital Desa"
```

### **B. Buat Repository di GitHub**

1. Buka [GitHub](https://github.com)
2. Klik **"+"** → **"New repository"**
3. Nama: `layanan-digital-desa` (atau nama lain)
4. Visibility: **Public** atau **Private** (terserah)
5. **JANGAN** centang "Add README" (kita sudah punya code)
6. Klik **"Create repository"**

### **C. Push ke GitHub**

Copy command dari GitHub page:

```bash
git remote add origin https://github.com/YOUR_USERNAME/layanan-digital-desa.git
git branch -M main
git push -u origin main
```

**Done!** Code sekarang ada di GitHub.

---

## 🚀 STEP 5: DEPLOY KE RAILWAY

### **Method 1: Deploy via GitHub (Recommended)**

1. **Login ke Railway**
   - Buka [railway.app](https://railway.app/)
   - Login dengan GitHub

2. **Buat Project Baru**
   - Klik **"New Project"**
   - Pilih **"Deploy from GitHub repo"**

3. **Connect Repository**
   - Pilih repository `layanan-digital-desa`
   - Railway akan auto-detect `package.json`

4. **Configure Build**
   - Builder: **Nixpacks** (default)
   - Start Command: `npm start` (otomatis terdeteksi)

5. **Add MySQL Database**
   - Klik tab **"Variables"**
   - Klik **"New Variable"**
   - Masukkan credentials dari Step 2:
     ```
     MYSQLHOST = ...
     MYSQLUSER = ...
     MYSQLPASSWORD = ...
     MYSQLDATABASE = surat_desa
     MYSQLPORT = 3306
     ```

6. **Deploy!**
   - Klik **"Deploy"**
   - Tunggu build selesai (~3-5 menit)

---

### **Method 2: Deploy via CLI (Alternative)**

Install Railway CLI:

```bash
npm install -g @railway/cli
```

Login:

```bash
railway login
```

Init project:

```bash
railway init
```

Add MySQL:

```bash
railway add mysql
```

Deploy:

```bash
railway up
```

---

## ⚙️ STEP 6: CONFIGURATION POST-DEPLOY

### **A. Setup CORS untuk Production**

Update `server/app.js`:

```javascript
const cors = require("cors");

// Allow production domain
app.use(cors({
  origin: ['https://your-domain.railway.app', 'http://localhost:3000'],
  credentials: true
}));
```

### **B. Set PORT Dynamic**

Update `server/app.js`:

```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`🌐 URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:' + PORT}`);
});
```

---

## 🗄️ STEP 7: MIGRATE DATABASE

### **A. Connect ke Database Railway**

Dari Railway dashboard:
1. Klik MySQL service
2. Tab **"Connect"**
3. Copy **"Connection String"**

Atau gunakan credentials dari Environment Variables.

### **B. Run Schema SQL**

Connect via MySQL client atau Railway's built-in console:

```bash
mysql -h <host> -u <user> -p<password> <database>
```

Kemudian run:

```sql
-- From server/database/schema.sql
CREATE DATABASE IF NOT EXISTS surat_desa;
USE surat_desa;

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

-- Insert sample data
INSERT INTO jenis_surat (nama, template) VALUES 
('Surat Keterangan Usaha', 'Template...'),
('Surat Keterangan Tidak Mampu', 'Template...'),
('Surat Pengantar KTP', 'Template...');
```

---

## 🌐 STEP 8: AKSES APLIKASI

### **Dapatkan Public URL**

Railway akan generate URL otomatis:
```
https://your-app-production.up.railway.app
```

Atau connect custom domain (optional):
```
https://surat-desaambokulon.com
```

### **Test Aplikasi**

1. **Frontend:**
   ```
   https://your-app-production.up.railway.app
   ```

2. **Admin Dashboard:**
   ```
   https://your-app-production.up.railway.app/admin.html
   Password: admin123
   ```

3. **API:**
   ```
   https://your-app-production.up.railway.app/pengajuan/admin/list
   ```

---

## 🔧 TROUBLESHOOTING

### **Problem 1: Build Failed**

**Cause:** Missing dependencies atau wrong start command

**Solution:**
```bash
# Check package.json has correct scripts
cat package.json

# Install all dependencies locally
npm install

# Test locally first
npm start
```

---

### **Problem 2: Database Connection Error**

**Logs show:**
```
❌ Database connection failed: ...
```

**Solution:**
1. Check Environment Variables di Railway dashboard
2. Pastikan semua variables (`MYSQLHOST`, `MYSQLUSER`, dll) ada
3. Restart service setelah update variables

---

### **Problem 3: CORS Error di Browser**

**Console shows:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solution:**
Update CORS config di `server/app.js`:
```javascript
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true
}));
```

---

### **Problem 4: QR Code URL Masih Localhost**

**Issue:** QR Code mengarah ke `http://localhost:3000`

**Solution:**
Update QR URL di `server/utils/pdfGenerator.js`:

```javascript
const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : 'http://localhost:3000';

const urlValidasi = `${baseUrl}/cek-surat/${dataRapi.nomor_surat.replace(/\//g, '-')}`;
```

---

## 📊 MONITORING & MAINTENANCE

### **Check Logs**

Railway dashboard → Logs tab

Real-time logs aplikasi Anda.

### **Auto-Deploy**

Setiap kali push ke GitHub:
```bash
git add .
git commit -m "Fix bug"
git push origin main
```

Railway akan auto-deploy! 🎉

### **Database Backup**

Export data rutin:
```bash
mysqldump -h <host> -u <user> -p<password> <database> > backup.sql
```

---

## 💰 RAILWAY PRICING

### **Free Tier (Hobby):**
- ✅ $5 credit/month (cukup untuk small app)
- ✅ 500 hours runtime
- ✅ 1GB RAM
- ✅ MySQL included

### **When to Upgrade:**
- If you exceed $5 credit
- Need more RAM/CPU
- Need priority support

---

## ✅ DEPLOYMENT CHECKLIST

```
Pre-Deployment:
[✅] .gitignore created
[✅] package.json complete
[✅] railway.json created
[✅] db.js updated for env vars
[✅] Code pushed to GitHub

Railway Setup:
[ ] MySQL provisioned
[ ] Environment variables set
[ ] GitHub repo connected
[ ] Deploy initiated
[ ] Build successful

Post-Deployment:
[ ] Database migrated
[ ] Frontend accessible
[ ] Admin dashboard working
[ ] PDF generation tested
[ ] QR validation working
[ ] Excel export functional
```

---

## 🎉 CONGRATULATIONS!

Jika semua langkah sudah dilakukan, aplikasi Anda sekarang:

✅ **Live on Internet**
✅ **Auto-deploy on git push**
✅ **MySQL database connected**
✅ **Production-ready**
✅ **Accessible worldwide**

**Next Steps:**
1. Share URL ke perangkat desa
2. Train user cara pakai
3. Monitor usage
4. Collect feedback

---

**Happy Deploying!** 🚀✨

*Last Updated: March 24, 2025*
