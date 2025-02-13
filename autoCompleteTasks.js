const puppeteer = require("puppeteer");

// URL halaman tugas yang harus diklik
const QUEST_URL = "https://quest.arenavs.com"; 

(async () => {
  // Buka browser tanpa tampilan (headless mode)
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log("Membuka halaman Quest...");
    await page.goto(QUEST_URL, { waitUntil: "networkidle2" });

    // Tunggu halaman termuat
    await page.waitForTimeout(2000);

    // Klik tombol pertama (Twitter, Discord, dll.)
    console.log("Klik tugas pertama...");
    await page.click('button'); // Ganti selector ini dengan selector yang sesuai

    // Tunggu sebentar lalu keluar
    await page.waitForTimeout(1000);
    await page.goBack();

    // Klik tombol kedua (tugas lainnya)
    console.log("Klik tugas kedua...");
    await page.click('button'); // Ganti selector ini dengan selector yang sesuai

    // Tunggu sebentar lalu keluar
    await page.waitForTimeout(1000);
    await page.goBack();

    // Terakhir, klik "Akses Akun" untuk menyelesaikan
    console.log("Klik Akses Akun...");
    await page.click('button'); // Ganti selector ini dengan selector "Akses Akun"

    console.log("Semua tugas selesai!");

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    // Tutup browser
    await browser.close();
  }
})();
