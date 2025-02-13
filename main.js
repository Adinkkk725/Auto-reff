const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');
const readline = require('readline');

// Fungsi untuk membuat interface input terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fungsi untuk membuat wallet baru
function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
}

// Fungsi untuk menyimpan wallet ke file
function saveWallet(wallet) {
  const filePath = 'wallets.json';
  let wallets = [];

  if (fs.existsSync(filePath)) {
    wallets = JSON.parse(fs.readFileSync(filePath));
  }

  wallets.push(wallet);
  fs.writeFileSync(filePath, JSON.stringify(wallets, null, 2));
}

// Fungsi untuk mendaftarkan wallet dengan kode referral
async function registerWallet(walletAddress, referralCode) {
  const url = 'https://quest-api.arenavs.com/api/v1/users/initialize';
  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://quest.arenavs.com',
    'Referer': 'https://quest.arenavs.com/'
  };
  const data = {
    walletAddress: walletAddress,
    referralCode: referralCode
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`✅ Wallet ${walletAddress} berhasil didaftarkan dengan referral ${referralCode}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Gagal mendaftarkan wallet ${walletAddress}: ${error.message}`);
  }
}

// Fungsi untuk mensimulasikan penyelesaian tugas
async function completeTasks(walletAddress) {
  const tasks = [
    { name: 'Follow X', endpoint: '/api/v1/tasks/follow-x' },
    { name: 'Like dan Retweet X', endpoint: '/api/v1/tasks/like-retweet-x' },
    { name: 'Invite Friend di X', endpoint: '/api/v1/tasks/invite-friend-x' },
    { name: 'Claim Role di Discord', endpoint: '/api/v1/tasks/claim-discord-role' }
  ];

  for (const task of tasks) {
    try {
      const url = `https://quest-api.arenavs.com${task.endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://quest.arenavs.com',
        'Referer': 'https://quest.arenavs.com/',
        'Authorization': `Bearer ${walletAddress}` // Asumsi token disimpan sebagai walletAddress
      };
      const data = { walletAddress: walletAddress };

      const response = await axios.post(url, data, { headers });
      console.log(`✅ Tugas '${task.name}' selesai untuk wallet ${walletAddress}`);
    } catch (error) {
      console.error(`❌ Gagal menyelesaikan tugas '${task.name}' untuk wallet ${walletAddress}: ${error.message}`);
    }
  }
}

// Fungsi utama untuk menjalankan proses
async function main() {
  rl.question('Masukkan kode referral: ', (referralCode) => {
    rl.question('Berapa banyak akun yang ingin dibuat? ', async (jumlah) => {
      jumlah = parseInt(jumlah);

      for (let i = 0; i < jumlah; i++) {
        console.log(`\n🚀 Membuat wallet ke-${i + 1}...`);
        const wallet = generateWallet();
        saveWallet(wallet);

        console.log(`🔗 Wallet Address: ${wallet.address}`);
        console.log(`🔐 Private Key: ${wallet.privateKey}`);

        await registerWallet(wallet.address, referralCode);
        await completeTasks(wallet.address);
      }

      console.log('\n✅ Semua proses selesai!');
      rl.close();
    });
  });
}

main();
