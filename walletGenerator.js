const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");

// Buat interface untuk input terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Minta jumlah akun yang ingin dibuat
rl.question("Masukkan jumlah akun yang ingin dibuat: ", (jumlah) => {
  jumlah = parseInt(jumlah);
  if (isNaN(jumlah) || jumlah <= 0) {
    console.log("Jumlah akun harus berupa angka positif.");
    rl.close();
    return;
  }

  let wallets = [];

  for (let i = 0; i < jumlah; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }

  // Simpan ke file JSON
  fs.writeFileSync("wallets.json", JSON.stringify(wallets, null, 2));

  console.log(`${jumlah} wallet berhasil dibuat! Cek file wallets.json`);
  rl.close();
});
