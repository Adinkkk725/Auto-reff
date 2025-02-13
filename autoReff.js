const fs = require("fs");
const axios = require("axios");

// Load wallet data
const walletData = JSON.parse(fs.readFileSync("wallet.json", "utf-8"));

// Konfigurasi API Referral
const REFERRAL_API = "https://quest-api.arenavs.com/api/v1/users/initialize";
const REFERRAL_CODE = "X14PSQWN"; // Ganti dengan referral code kamu

async function registerReferral() {
    try {
        const response = await axios.post(REFERRAL_API, {
            walletAddress: walletData.address,
            referralCode: REFERRAL_CODE
        });

        console.log("Referral berhasil didaftarkan:", response.data);
    } catch (error) {
        console.error("Gagal mendaftar referral:", error.response ? error.response.data : error.message);
    }
}

// Jalankan auto referral
registerReferral();
