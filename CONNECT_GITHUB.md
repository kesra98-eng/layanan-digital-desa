# 🔗 PANDUAN CONNECT KE GITHUB REPOSITORY

## 📋 STEP-BY-STEP LENGKAP

---

## ⚠️ PROBLEM: GIT BELUM TERINSTALL

Anda perlu install Git terlebih dahulu sebelum bisa connect ke repository.

---

## ✅ SOLUSI 1: INSTALL GIT (RECOMMENDED)

### **Step 1: Download Git**

1. Buka https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run installer
4. Install dengan default settings
5. Finish

### **Step 2: Restart Terminal**

Setelah install, **TUTUP PowerShell** dan buka lagi!

### **Step 3: Verify Git Terinstall**

```powershell
git --version
```

Expected output:
```
git version 2.x.x.windows.1
```

---

## 🚀 CONNECT KE REPOSITORY

### **Method 1: Clone Repository (Jika Folder Kosong)**

Jika Anda ingin clone dari GitHub:

```powershell
cd "e:\web desa\Layanan_Digital"
git clone https://github.com/kesra98-eng/layanan-digital-desa.git .
```

**Note:** Tanda `.` di akhir artinya clone ke folder current.

**WARNING:** Ini akan replace semua file yang sudah ada!

---

### **Method 2: Connect Existing Project (RECOMMENDED)**

Karena project sudah ada, gunakan cara ini:

#### **Step A: Initialize Git Local**

```powershell
cd "e:\web desa\Layanan_Digital"
git init
```

#### **Step B: Add Remote Repository**

```powershell
git remote add origin https://github.com/kesra98-eng/layanan-digital-desa.git
```

#### **Step C: Verify Connection**

```powershell
git remote -v
```

Expected output:
```
origin  https://github.com/kesra98-eng/layanan-digital-desa.git (fetch)
origin  https://github.com/kesra98-eng/layanan-digital-desa.git (push)
```

#### **Step D: Add Semua File**

```powershell
git add .
```

#### **Step E: Commit Pertama**

```powershell
git commit -m "Initial commit - Railway ready deployment"
```

#### **Step F: Push ke GitHub**

```powershell
git branch -M main
git push -u origin main
```

---

## 🔐 JIKA MINTA LOGIN

GitHub akan minta authentication:

### **Option 1: GitHub Personal Access Token (Recommended)**

1. Buka https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Beri nama: "Railway Deployment"
4. Centang permissions:
   - ✅ repo (Full control of private repositories)
   - ✅ workflow
5. Generate token
6. **COPY TOKEN** (simpan baik-baik, tidak bisa dilihat lagi!)

Saat push, gunakan token sebagai password:
```
Username: kesra98-eng
Password: <paste token kamu>
```

### **Option 2: GitHub CLI (Lebih Mudah)**

Install GitHub CLI:
```powershell
winget install GitHub.cli
```

Login:
```powershell
gh auth login
```

Ikuti instruksi di layar, lalu:
```powershell
git push -u origin main
```

---

## 🧪 VERIFIKASI

### **Check Status**

```powershell
git status
```

Expected: "Your branch is up to date with 'origin/main'"

### **Check Remote**

```powershell
git remote -v
```

Expected: Shows origin pointing to your repo

### **Check Branch**

```powershell
git branch
```

Expected: "* main"

---

## 🎯 ALTERNATIF: GUNAKAN GITHUB DESKTOP

Jika command line terlalu sulit, gunakan GUI:

### **Step 1: Download GitHub Desktop**

https://desktop.github.com/

### **Step 2: Install & Login**

1. Install GitHub Desktop
2. Login dengan akun GitHub Anda

### **Step 3: Add Project**

1. File → Add Local Repository
2. Choose folder: `e:\web desa\Layanan_Digital`
3. Jika muncul error, click "Create a repository"

### **Step 4: Publish ke GitHub**

1. Click "Publish repository"
2. Name: `layanan-digital-desa`
3. Uncheck "Keep this code private" (jika ingin public)
4. Publish

### **Step 5: Sync dengan Remote**

Jika repo sudah ada di GitHub:
1. File → Clone Repository
2. Pilih `kesra98-eng/layanan-digital-desa`
3. Clone ke folder baru
4. Copy semua file project lama ke folder baru
5. Commit & Push

---

## 📦 UPLOAD MANUAL (LAST RESORT)

Jika semua cara gagal, upload manual:

### **Step 1: Zip Project**

1. Select semua file di folder `Layanan_Digital`
2. Exclude `node_modules`
3. Right-click → Send to → Compressed folder
4. Rename jadi `project.zip`

### **Step 2: Upload ke GitHub**

1. Buka https://github.com/kesra98-eng/layanan-digital-desa
2. Drag & drop `project.zip` ke browser
3. Upload files

**KEKURANGAN:** Tidak ada git history, susah update selanjutnya

---

## 🚨 TROUBLESHOOTING

### **Error: "remote origin already exists"**

```powershell
git remote remove origin
git remote add origin https://github.com/kesra98-eng/layanan-digital-desa.git
```

### **Error: "Updates were rejected because the remote contains work"**

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### **Error: "Permission denied (publickey)"**

Setup SSH key:
```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy output, paste ke GitHub → Settings → SSH and GPG keys → New SSH key
```

### **Error: Git tidak dikenali setelah install**

Restart komputer, atau:
1. System Properties → Environment Variables
2. Path → Edit → New
3. Add: `C:\Program Files\Git\bin`
4. OK, restart terminal

---

## ✅ CHECKLIST CONNECTION

```
[ ] Git installed (git --version)
[ ] Repository initialized (git init)
[ ] Remote added (git remote add origin ...)
[ ] Files added (git add .)
[ ] First commit (git commit -m "...")
[ ] Branch renamed (git branch -M main)
[ ] Pushed to GitHub (git push -u origin main)
[ ] Verified on GitHub (check website)
```

---

## 🎉 NEXT STEPS SETELAH CONNECT

Setelah berhasil push ke GitHub:

1. **Verify di GitHub**
   - Buka https://github.com/kesra98-eng/layanan-digital-desa
   - Check semua file ter-upload

2. **Deploy ke Railway**
   - Login Railway
   - New Project → GitHub repo
   - Pilih `layanan-digital-desa`
   - Deploy!

3. **Setup Database**
   - Provision MySQL di Railway
   - Set environment variables
   - Run migration SQL

---

## 📞 BANTUAN LEBIH LANJUT

Jika masih ada masalah:

1. Screenshot error message
2. Share di GitHub Issues
3. Atau tanya langsung di chat

---

**Good luck!** 🚀✨

**Quick Start (jika Git sudah terinstall):**
```powershell
cd "e:\web desa\Layanan_Digital"
git init
git remote add origin https://github.com/kesra98-eng/layanan-digital-desa.git
git add .
git commit -m "Ready for Railway"
git branch -M main
git push -u origin main
```
