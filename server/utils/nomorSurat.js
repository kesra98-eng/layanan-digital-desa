function getRomawi(bulan) {
  const romawi = [
    "I","II","III","IV","V","VI",
    "VII","VIII","IX","X","XI","XII"
  ];
  return romawi[bulan - 1];
}

function generateNomorSurat(lastNumber) {
  const now = new Date();

  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const romawi = getRomawi(bulan);

  const nomorUrut = String(lastNumber + 1).padStart(3, "0");

  return `470/${nomorUrut}/DS/${romawi}/${tahun}`;
}

module.exports = generateNomorSurat;