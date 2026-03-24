const PDFDocument = require("pdfkit");
const path = require("path");
const QRCode = require("qrcode");
const renderTemplate = require("./templateEngine");

// Fungsi pembantu agar tulisan rapi (Andi, bukan andi)
function formatTeks(str) {
  if (!str) return "";
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// 🔥 FUNGSI TANGGAL DENGAN TIMEZONE INDONESIA
function formatTanggalIndonesia() {
  return new Date().toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function generatePDF(res, data) {
  // 🔥 DETECT BASE URL (LOCALHOST ATAU PRODUCTION)
  const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;

  // 1. SIAPKAN DATA YANG SUDAH RAPI
  const dataRapi = {
    nomor_surat: data.nomor_surat,
    nama: formatTeks(data.nama),        // Auto capitalization untuk nama
    nik: data.nik,                       // NIK tetap apa adanya
    alamat: data.alamat,                 // ALAMAT SESUAI INPUT MANUAL WARGA (tidak diformat)
    keperluan: data.keperluan, 
    jenis_surat: data.jenis_surat.toUpperCase(),
    tanggal_ttd: formatTanggalIndonesia() // 🔥 PAKAI TIMEZONE INDONESIA
  };

  // Setup PDF dengan encoding yang benar
  const doc = new PDFDocument({ 
    size: "A4", 
    margin: 50,
    bufferPages: true,
    autoFirstPage: true
  });
  
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=surat-${data.id}.pdf`);
  doc.pipe(res);

  const pageWidth = doc.page.width;

  // 2. KOP SURAT
  try {
    const logoPath = path.join(__dirname, "../assets/logo.png");
    doc.image(logoPath, 55, 45, { width: 50 });
  } catch (err) {}

  doc.font("Helvetica-Bold").fontSize(12).text("PEMERINTAH KABUPATEN PEMALANG", { align: "center" });
  doc.text("KECAMATAN COMAL", { align: "center" });
  doc.fontSize(14).text("KANTOR KEPALA DESA AMBOKULON", { align: "center" });
  doc.font("Helvetica").fontSize(9).text("Jl. Desa Ambokulon, Dusun III RT 006 RW 003 Kode Pos 52363", { align: "center" });
  doc.moveTo(50, 115).lineTo(pageWidth - 50, 115).lineWidth(1.5).stroke();
  doc.moveTo(50, 118).lineTo(pageWidth - 50, 118).lineWidth(0.5).stroke();

  let y = 145;

  // 3. JUDUL & NOMOR
  doc.font("Helvetica-Bold").fontSize(13).text(dataRapi.jenis_surat, 0, y, { align: "center", underline: true });
  y += 18;
  doc.font("Helvetica").fontSize(11).text(`Nomor: ${dataRapi.nomor_surat}`, 0, y, { align: "center" });
  y += 40;

  // 4. PEMBUKA
  doc.fontSize(11).text("Yang bertanda tangan di bawah ini:", 50, y);
  y += 20;

  const drawRow = (label, value, currentY) => {
    doc.font("Helvetica-Bold").text(label, 80, currentY);
    doc.font("Helvetica").text(`: ${value}`, 200, currentY);
    return currentY + 18;
  };

  y = drawRow("Nama", "MUKSININ", y);
  y = drawRow("Jabatan", "Kepala Desa Ambokulon", y);
  y += 10;
  doc.font("Helvetica").text("Menerangkan dengan sebenarnya bahwa:", 50, y);
  y += 20;
  y = drawRow("Nama Lengkap", dataRapi.nama, y);
  y = drawRow("NIK", dataRapi.nik, y);
  y = drawRow("Alamat", dataRapi.alamat, y);
  y += 15;

  // 5. ISI SURAT (BERSIHKAN KARAKTER ANEH)
  let isiSurat = renderTemplate(data.template, dataRapi);
  
  // 🔥 FIX KARAKTER Ð - BERSIHKAN TEKS DENGAN BENAR
  // Hapus hanya kontrol karakter yang tidak diinginkan
  isiSurat = isiSurat.replace(/\r\n/g, '\n');     // Normalisasi Windows line endings
  isiSurat = isiSurat.replace(/\r/g, '');          // Hapus carriage return
  isiSurat = isiSurat.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ''); // Hapus kontrol karakter
  
  doc.font("Helvetica").fontSize(11).text(isiSurat, 50, y, { 
    width: pageWidth - 100, 
    align: "justify",
    lineGap: 3
  });

  y = doc.y + 25;
  doc.text("Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.", 50, y);

  // 6. TANDA TANGAN & QR CODE
  y = doc.y + 40; 
  const ttdX = pageWidth - 230; // Digeser sedikit ke kiri agar nama panjang tidak terpotong
  const qrY = y + 10;

  doc.text(`Ambokulon, ${dataRapi.tanggal_ttd}`, ttdX, y, { align: 'center', width: 200 });
  doc.text("Kepala Desa,", ttdX, y + 15, { align: 'center', width: 200 });

  try {
    // 🔥 URL VALIDASI - AUTO DETECT PRODUCTION ATAU LOCALHOST
    const urlValidasi = `${baseUrl}/cek-surat/${dataRapi.nomor_surat.replace(/\//g, '-')}`;
    const qrImage = await QRCode.toDataURL(urlValidasi, { margin: 1 });
    
    // Tempatkan QR di sebelah kiri tanda tangan
    doc.image(qrImage, 60, qrY, { width: 85 });
    doc.fontSize(7).text("Scan untuk validasi", 55, qrY + 88, { width: 95, align: 'center' });
  } catch (err) {
    console.error("QR Error:", err);
  }

  // 🔥 NAMA KEPALA DESA (FONT LEBIH BESAR - 16pt)
  y += 85; 
  doc.font("Helvetica-Bold").fontSize(14).text("MUKSININ", ttdX, y, { 
    underline: true,
    align: 'center',
    width: 200
  });
  
  // Selesaikan dokumen
  doc.end();
}

module.exports = generatePDF;
