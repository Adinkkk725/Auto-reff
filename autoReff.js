const fs = require("fs");
const axios = require("axios");
const readline = require("readline");

// Buat interface untuk input terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load semua wallet dari file
let wallets;
try {
  wallets = JSON.parse(fs.readFileSync("wallets.json", "utf-8"));
} catch (error) {
  console.error("Error membaca file wallets.json. Pastikan sudah menjalankan walletGenerator.js!");
  process.exit(1);
}

// Minta input referral code dari user
rl.question("Masukkan kode referral: ", async (referralCode) => {
  const apiUrl = "https://quest-api.arenavs.com/api/v1/users/initialize";

  for (const wallet of wallets) {
    try {
      const response = await axios.post(apiUrl, {
        walletAddress: wallet.address,
        referralCode: referralCode
      });

      console.log(`Referral sukses untuk wallet ${wallet.address}:`, response.data);
    } catch (error) {
      console.error(`Gagal mengirim referral untuk wallet ${wallet.address}:`, error.response?.data || error.message);
    }
  }

  rl.close();
});
