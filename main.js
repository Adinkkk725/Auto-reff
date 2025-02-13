const axios = require("axios");
const ethers = require("ethers");
const readline = require("readline-sync");

const API_URL = "https://quest-api.arenavs.com/api/v1"; // URL API utama

// Fungsi untuk delay (menunggu beberapa detik sebelum lanjut)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fungsi untuk membuat wallet baru
function buatWalletBaru() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

// Fungsi untuk mendaftarkan wallet dengan kode referral
async function daftarWallet(walletAddress, referralCode) {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            walletAddress,
            referralCode
        });

        if (response.status === 200) {
            console.log(`✅ Wallet ${walletAddress} berhasil didaftarkan dengan referral ${referralCode}`);
            return true;
        }
    } catch (error) {
        console.log(`❌ Gagal mendaftarkan wallet ${walletAddress}: ${error.response ? error.response.status : error.message}`);
    }
    return false;
}

// Fungsi untuk menyelesaikan task tertentu
async function selesaikanTask(walletAddress, taskId, taskName) {
    try {
        const response = await axios.post(`${API_URL}/tasks/${taskId}/complete`, {}, {
            headers: {
                "Authorization": `Bearer ${walletAddress}`, // Pastikan token atau header benar
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            console.log(`✅ Task '${taskName}' berhasil diselesaikan untuk wallet ${walletAddress}`);
            return true;
        }
    } catch (error) {
        console.log(`❌ Gagal menyelesaikan task '${taskName}' untuk wallet ${walletAddress}: ${error.response ? error.response.status : error.message}`);
    }
    return false;
}

// Fungsi utama untuk menjalankan proses
async function mulai() {
    const jumlahAkun = readline.questionInt("Berapa akun yang ingin dibuat? ");
    const referralCode = readline.question("Masukkan kode referral: ");

    for (let i = 0; i < jumlahAkun; i++) {
        console.log(`\n🚀 Membuat wallet ke-${i + 1}...`);

        const wallet = buatWalletBaru();
        console.log(`🔗 Wallet Address: ${wallet.address}`);

        const sukses = await daftarWallet(wallet.address, referralCode);

        if (sukses) {
            console.log("🔄 Menyelesaikan task...");
            await selesaikanTask(wallet.address, 1, "Follow X");
            await selesaikanTask(wallet.address, 2, "Like & Retweet X");
            await selesaikanTask(wallet.address, 3, "Invite Friend di X");
            await selesaikanTask(wallet.address, 4, "Claim Role di Discord");
            console.log("✅ Semua task telah diselesaikan untuk wallet ini.");
        }

        // Delay acak antara 30-60 detik sebelum membuat akun berikutnya
        const delayTime = 30000 + Math.random() * 30000;
        console.log(`⏳ Menunggu ${Math.round(delayTime / 1000)} detik sebelum membuat wallet berikutnya...`);
        await delay(delayTime);
    }

    console.log("\n✅ Semua akun telah dibuat dan tugas selesai!");
}

mulai();
