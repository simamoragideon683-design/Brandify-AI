# Brandify AI — Studio Lokal V3

Studio branding UMKM berbasis template lokal. Nama proyek tetap Brandify AI untuk konsistensi merek, tetapi tidak ada model AI, backend, autentikasi, API key, atau pengiriman brief. Semua interaksi, foto, dan ekspor dibuat di browser. Tailwind CSS statis CDN dipertahankan dari versi sebelumnya; jaringan tidak dibutuhkan untuk logika generator. CSS kustom disertakan.

## Fitur
- 6 komposisi logo dengan 12 variasi simbol; pilih dan unduh SVG/PNG transparan.
- 3 nama dan slogan sesuai kategori; 6 gaya tipografi berbasis font sistem. Pemilihan disimpan pada brand kit.
- 5 warna, 3 mockup per jenis produk dalam 7 kategori, PNG/SVG.
- 3 desain Instagram potret 1080x1350, caption, simulasi feed. Foto produk asli JPEG/PNG/WebP (maksimum 10 MB) dapat dipilih lokal, diperkecil dan digunakan untuk desain; foto tidak dipersistenkan.
- Analisis berbasis brief, brand guideline TXT/print PDF dan ekspor kit JSON.

Mockup SVG bukan foto fotorealistis hasil generasi AI. Foto produk asli yang dipilih pengguna dapat membuat konten lebih realistis. Desain bukan jaminan ketersediaan merek, keakuratan produk, atau file siap produksi. Font sistem dapat berbeda antar perangkat. Preview Instagram bukan unggahan nyata.

## File
- index.html: antarmuka dan CSP meta
- style.css: gaya dan layout responsif
- app.js: seluruh generator, validasi, render DOM aman, dan ekspor lokal
- vercel.json: 8 security headers; CSP melarang koneksi API dan skrip inline. data: diizinkan hanya untuk gambar lokal yang telah dirasterisasi.
- assets/bumi-brew.webp: contoh branding di banner

## Upgrade repository yang sudah ada
1. Ganti index.html, style.css, app.js, vercel.json, README.md dan assets/bumi-brew.webp dengan versi ini.
2. PENTING: hapus folder api/ beserta generate.js dan product-image.js di GitHub. Upload file baru saja tidak otomatis menghapus file lama. Tidak ada backend pada versi ini.
3. Commit ke main. Vercel akan membangun deployment baru (Framework Preset: Other). Pastikan deployment Production terbaru berstatus Ready.
4. Environment Variables GEMINI_API_KEY, GEMINI_MODEL, GEMINI_IMAGE_MODEL, BRANDIFY_ACCESS_CODE tidak dibutuhkan. Hapus dari Vercel, cabut/rotasi API key di Google bila tidak digunakan proyek lain, dan perhatikan deployment lama yang masih bisa diakses; hapus atau lindungi deployment lama jika perlu. Jangan commit kredensial atau .env.
5. Buka URL HTTPS produksi, refresh Ctrl+Shift+R, gunakan contoh lalu buat brand kit. Uji logo, nama, desain produk, Instagram, PNG, dan guideline.
6. Periksa HTTP security headers dengan curl -I URL-produksi. Vercel mengendalikan header Server; tidak ada backend X-Powered-By aplikasi. HTTPS/HSTS hanya dapat diuji di hosting.

## Lokal
Jalankan python -m http.server 8000 dalam folder proyek, buka http://localhost:8000. Tidak perlu instalasi npm atau konfigurasi Gemini. Foto dan pilihan brand diproses lokal. Browser menyimpan brief dan kit via localStorage (hapus melalui tombol Hapus data lokal). Foto hanya tersimpan selama sesi, hilang jika membuat brand kit baru atau refresh.
