const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi delay untuk menghindari rate limit (429)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fungsi untuk membuat wallet (dummy)
function generateWallet() {
  const walletAddress = "0x" + Math.random().toString(36).substring(2, 42);
  const privateKey = "0x" + Math.random().toString(36).substring(2, 64);
  return { walletAddress, privateKey };
}

// Fungsi untuk daftar akun dengan referral
async function registerWallet(walletAddress, referralCode) {
  try {
    const response = await axios.post(
      "https://quest-api.arenavs.com/api/v1/users/initialize",
      { walletAddress: walletAddress, referralCode: referralCode },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`❌ Gagal mendaftarkan wallet ${walletAddress}: ${error.response?.status || error.message}`);
    return null;
  }
}

// Fungsi untuk menyelesaikan task (Follow X, Like & RT, Invite, Discord)
async function completeTasks(walletAddress, authToken) {
  const tasks = [
    { id: 1, name: "Follow X" },
    { id: 2, name: "Like dan Retweet X" },
    { id: 3, name: "Invite Friend di X" },
    { id: 4, name: "Claim Role di Discord" },
  ];

  for (const task of tasks) {
    try {
      await axios.post(
        `https://quest-api.arenavs.com/api/v1/tasks/${task.id}/complete/1649811`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          },
        }
      );
      console.log(`✅ Berhasil menyelesaikan tugas '${task.name}' untuk wallet ${walletAddress}`);
    } catch (error) {
      console.log(`❌ Gagal menyelesaikan tugas '${task.name}' untuk wallet ${walletAddress}: ${error.response?.status || error.message}`);
    }
    await delay(10000); // Delay antar tugas
  }
}

// Main function
async function main() {
  rl.question("Berapa akun yang ingin dibuat? ", async (jumlahAkun) => {
    jumlahAkun = parseInt(jumlahAkun);
    if (isNaN(jumlahAkun) || jumlahAkun <= 0) {
      console.log("Jumlah akun tidak valid.");
      rl.close();
      return;
    }

    rl.question("Masukkan kode referral: ", async (referralCode) => {
      for (let i = 1; i <= jumlahAkun; i++) {
        console.log(`🚀 Membuat wallet ke-${i}...`);

        // Generate wallet
        const wallet = generateWallet();
        console.log(`🔗 Wallet Address: ${wallet.walletAddress}`);
        console.log(`🔐 Private Key: ${wallet.privateKey}`);

        // Register wallet
        const registerResponse = await registerWallet(wallet.walletAddress, referralCode);
        if (!registerResponse) continue;

        // Ambil token dari response jika ada
        const authToken = registerResponse.authToken || null;
        if (!authToken) {
          console.log(`❌ Gagal mendapatkan token untuk wallet ${wallet.walletAddress}`);
          continue;
        }

        // Selesaikan quest
        await completeTasks(wallet.walletAddress, authToken);

        // Delay sebelum membuat akun berikutnya
        console.log("⏳ Menunggu sebelum membuat akun berikutnya...");
        await delay(10000);
      }
      console.log("✅ Semua akun telah selesai dibuat dan tugas diselesaikan.");
      rl.close();
    });
  });
}

// Jalankan script
main();
