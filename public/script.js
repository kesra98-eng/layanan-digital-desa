// Gunakan relative URL agar bisa diakses dari HP (IP Address)
const API_URL = ""; 

// =========================
// LOAD JENIS SURAT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_URL}/jenis-surat`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("jenis_surat");
      data.forEach(item => {
        const option = new Option(item.nama, item.id);
        select.add(option);
      });
    })
    .catch(err => console.error("Gagal load jenis surat:", err));
});

// =========================
// SUBMIT FORM
// =========================
document.getElementById("formPengajuan").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const btn = document.getElementById("btnSubmit");
  const msgEl = document.getElementById("message");
  
  // Validasi NIK Sederhana
  const nik = document.getElementById("nik").value;
  if (nik.length !== 16 || isNaN(nik)) {
    showMessage("❌ NIK harus 16 digit angka!", "error");
    return;
  }

  const data = {
    nama: document.getElementById("nama").value,
    nik: nik,
    alamat: document.getElementById("alamat").value,
    keperluan: document.getElementById("keperluan").value,
    jenis_surat_id: document.getElementById("jenis_surat").value,
  };

  try {
    btn.disabled = true;
    btn.innerText = "Sedang Mengirim...";

    const response = await fetch(`${API_URL}/pengajuan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok) {
      msgEl.innerHTML = `
        <div class="success-box">
          <span class="success-text">✅ Pengajuan Berhasil Disimpan!</span>
          <button onclick="cetakPDF(${resData.id})" style="background:#1e3a8a">
            🖨️ Cetak Surat Sekarang
          </button>
        </div>
      `;
      this.reset();
    } else {
      throw new Error(resData.message || "Gagal menyimpan");
    }
  } catch (err) {
    showMessage(`❌ Error: ${err.message}`, "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Kirim Pengajuan";
  }
});

function cetakPDF(id) {
  window.open(`${API_URL}/pengajuan/${id}/cetak`, "_blank");
}

function showMessage(msg, type) {
  const el = document.getElementById("message");
  el.innerHTML = `<div class="${type}">${msg}</div>`;
}