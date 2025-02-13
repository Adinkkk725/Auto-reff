const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs-extra');
const prompt = require('prompt-sync')();

// Fungsi untuk menunggu (delay)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function createWallet(referralCode) {
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    console.log(`🚀 Membuat wallet: ${walletAddress}`);

    try {
        const response = await axios.post(
            'https://quest-api.arenavs.com/api/v1/users/initialize',
            { walletAddress: walletAddress, referralCode: referralCode },
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log(`✅ Wallet ${walletAddress} berhasil didaftarkan dengan referral ${referralCode}`);

        return { walletAddress, privateKey };
    } catch (error) {
        console.error(`❌ Gagal mendaftarkan wallet ${walletAddress}: ${error.response?.status}`);
        return null;
    }
}

async function main() {
    const jumlahAkun = parseInt(prompt("Berapa akun yang ingin dibuat? "));
    const referralCode = prompt("Masukkan kode referral: ");

    if (isNaN(jumlahAkun) || jumlahAkun <= 0) {
        console.log("Jumlah akun tidak valid!");
        return;
    }

    let wallets = [];
    
    for (let i = 0; i < jumlahAkun; i++) {
        const wallet = await createWallet(referralCode);
        
        if (wallet) {
            wallets.push(wallet);
            fs.appendFileSync('wallets.txt', `${wallet.walletAddress} | ${wallet.privateKey}\n`);
        }

        // Tambahkan delay 5-10 detik sebelum membuat wallet berikutnya
        const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
        console.log(`⏳ Menunggu ${randomDelay / 1000} detik sebelum membuat wallet berikutnya...\n`);
        await delay(randomDelay);
    }

    console.log("✅ Semua akun telah selesai dibuat!");
}

main();
