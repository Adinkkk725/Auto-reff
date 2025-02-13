const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Fungsi untuk input user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk meminta input jumlah akun dan referral
function tanyaPertanyaan(pertanyaan) {
    return new Promise(resolve => {
        rl.question(pertanyaan, (jawaban) => {
            resolve(jawaban);
        });
    });
}

async function buatWallet() {
    // Simulasi pembuatan wallet (gunakan library web3 jika ingin real)
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const privateKey = `0x${Math.random().toString(16).substr(2, 64)}`;
    return { walletAddress, privateKey };
}

async function daftarAkun(wallet, referralCode) {
    const url = "https://quest-api.arenavs.com/api/v1/users/initialize";

    try {
        const response = await axios.post(url, {
            walletAddress: wallet.walletAddress,
            referralCode: referralCode
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`✅ Wallet ${wallet.walletAddress} berhasil didaftarkan dengan referral ${referralCode}`);
        return response.data;
    } catch (error) {
        console.log(`❌ Gagal mendaftarkan wallet ${wallet.walletAddress}: ${error.response ? error.response.status : error.message}`);
        return null;
    }
}

async function selesaikanTask(wallet, token) {
    const tasks = [1, 2, 3, 4]; // ID tugas
    const userId = "1649811"; // ID user (perlu dikonfirmasi lagi)

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
            console.log(`❌ Gagal menyelesaikan tugas ${task} untuk wallet ${wallet.walletAddress}: ${error.response ? error.response.status : error.message}`);
        }
    }
}

async function mulaiProses() {
    const jumlahAkun = await tanyaPertanyaan("Berapa akun yang ingin dibuat? ");
    const referralCode = await tanyaPertanyaan("Masukkan kode referral: ");
    rl.close();

    const akunTersimpan = [];

    for (let i = 0; i < parseInt(jumlahAkun); i++) {
        console.log(`🚀 Membuat wallet ke-${i + 1}...`);

        const wallet = await buatWallet();
        akunTersimpan.push(wallet);

        const userData = await daftarAkun(wallet, referralCode);

        if (userData && userData.token) {
            await selesaikanTask(wallet, userData.token);
        }

        // Delay untuk menghindari error 429 (Too Many Requests)
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    fs.writeFileSync('akun.json', JSON.stringify(akunTersimpan, null, 2));
    console.log("✅ Semua akun telah selesai dibuat dan tugas diselesaikan.");
}

mulaiProses();
