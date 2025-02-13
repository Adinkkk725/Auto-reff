const { ethers } = require("ethers");
const fs = require("fs");

// Generate a new wallet
const wallet = ethers.Wallet.createRandom();

// Wallet data
const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
};

// Save wallet data to a local file
fs.writeFileSync("wallet.json", JSON.stringify(walletData, null, 2));

console.log("Wallet berhasil dibuat!");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
