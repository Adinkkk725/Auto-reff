const fs = require("fs");
const axios = require("axios");
const ethers = require("ethers");
const readline = require("readline");

// Fungsi untuk input dari terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi untuk membuat wallet baru
function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// Fungsi untuk menyimpan wallet ke file
function saveWallet(wallet, referralData) {
  const filePath = "wallets.json";
  let wallets = [];

  if (fs.existsSync(filePath)) {
    wallets = JSON.parse(fs.readFileSync(filePath));
  }

  wallets.push({
    address: wallet.address,
    privateKey: wallet.privateKey,
    referralCode: referralData.referralCode,
    token: referralData.token,
  });

  fs.writeFileSync(filePath, JSON.stringify(wallets, null, 2));
}

// Fungsi untuk daftar referral
async function registerReferral(walletAddress, referralCode) {
  try {
    const response = await axios.post(
      "https://quest.arenavs.com/account", // URL API yang benar
      {
        walletAddress: walletAddress,
        referralCode: referralCode,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;
    console.log(`✅ Wallet ${walletAddress} berhasil didaftarkan dengan referral ${data.user.referralCode}`);
    return data;
  } catch (error) {
    if (error.response) {
      console.error(`❌ Error dari server: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`❌ Gagal daftar referral: ${error.message}`);
    }
    return null;
  }
}

// Fungsi untuk menyelesaikan tugas pendaftaran (simulasi klik)
async function completeTasks(walletAddress) {
  try {
    console.log(`🔄 Menyelesaikan tugas untuk wallet ${walletAddress}...`);
    
    // Simulasi klik (sebenarnya hanya delay)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(`✅ Tugas pendaftaran selesai untuk wallet ${walletAddress}`);
  } catch (error) {
    console.error(`❌ Gagal menyelesaikan tugas: ${error.message}`);
  }
}

// Proses utama
rl.question("Masukkan kode referral: ", (referralCode) => {
  rl.question("Berapa banyak akun yang ingin dibuat? ", async (jumlah) => {
    jumlah = parseInt(jumlah);

    for (let i = 0; i < jumlah; i++) {
      console.log(`\n🚀 Membuat wallet ke-${i + 1}...`);
      const wallet = generateWallet();

      console.log(`🔗 Wallet Address: ${wallet.address}`);
      console.log(`🔐 Private Key: ${wallet.privateKey}`);

      const referralData = await registerReferral(wallet.address, referralCode);
      if (referralData) {
        saveWallet(wallet, referralData);
        await completeTasks(wallet.address);
      } else {
        console.error(`⚠️ Pendaftaran gagal untuk wallet ${wallet.address}`);
      }
    }

    console.log("\n✅ Semua proses selesai!");
    rl.close();
  });
});
