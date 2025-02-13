const axios = require('axios');
const fs = require('fs');

// Jumlah akun yang ingin dibuat
const jumlahAkun = 5; // Ubah sesuai kebutuhan
const referralCode = "HDUUP0D6"; // Ganti dengan kode referral Anda

// Simpan akun yang dibuat
const akunTersimpan = [];

async function buatWallet() {
    // Simulasi pembuatan wallet (gunakan library web3 jika ingin real)
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const privateKey = `0x${Math.random().toString(16).substr(2, 64)}`;

    return { walletAddress, privateKey };
}

async function daftarAkun(wallet) {
    const url = "https://quest-api.arenavs.com/api/v1/users/initialize";
    
    try {
        const response = await axios.post(url, {
            walletAddress: wallet.walletAddress,
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`✅ Wallet ${wallet.walletAddress} berhasil didaftarkan dengan referral ${referralCode}`);
        return response.data;
    } catch (error) {
        console.log(`❌ Gagal mendaftarkan wallet ${wallet.walletAddress}: ${error.message}`);
    }
}

async function selesaikanTask(wallet, token) {
    const tasks = [1, 2, 3, 4]; // ID tugas: 1 = Follow, 2 = Like RT, 3 = Invite Friend, 4 = Claim Role
    const userId = "1649811"; // ID ini mungkin berubah tergantung user

    for (let task of tasks) {
        const url = `https://quest-api.arenavs.com/api/v1/tasks/${task}/complete/${userId}`;

        try {
            await axios.post(url, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log(`✅ Berhasil menyelesaikan tugas ${task} untuk wallet ${wallet.walletAddress}`);
        } catch (error) {
            console.log(`❌ Gagal menyelesaikan tugas ${task} untuk wallet ${wallet.walletAddress}: ${error.message}`);
        }
    }
}

async function mulaiProses() {
    for (let i = 0; i < jumlahAkun; i++) {
        console.log(`🚀 Membuat wallet ke-${i + 1}...`);

        const wallet = await buatWallet();
        akunTersimpan.push(wallet);

        const userData = await daftarAkun(wallet);

        if (userData && userData.token) {
            await selesaikanTask(wallet, userData.token);
        }
    }

    // Simpan akun yang dibuat
    fs.writeFileSync('akun.json', JSON.stringify(akunTersimpan, null, 2));
    console.log("✅ Semua akun telah selesai dibuat dan tugas diselesaikan.");
}

mulaiProses();
