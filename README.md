# Brandify AI
Studio branding berbahasa Indonesia untuk UMKM. Demo lokal berbasis aturan (bukan AI). Mode Gemini menghasilkan rekomendasi terstruktur melalui backend, kemudian browser membuat logo, kemasan dan desain Instagram SVG dari simbol/palet tervalidasi. Logo/kemasan adalah konsep vektor, bukan keluaran model generasi gambar atau dieline siap cetak. Nama belum diperiksa merek dagang.

## Struktur berkas
- `index.html`: struktur semantik, formulir, navigasi, dialog, CSP meta cadangan.
- `style.css`: desain responsif, fallback CSS lokal dan tampilan cetak.
- `app.js`: generator demo, render aman, SVG, penyimpanan lokal, ekspor, klien Gemini.
- `vercel.json`: enam security headers dan dua cross-origin headers.
- `api/generate.js`: endpoint POST Gemini server-side, pemeriksaan origin, akses, input dan hasil.
- `.gitignore`: mencegah file rahasia dan konfigurasi lokal ikut terunggah.

## Jalankan lokal
Di direktori proyek, jalankan `python -m http.server 8000` (Windows: `py -m http.server 8000`). Buka `http://localhost:8000`. Klik Gunakan contoh, lalu Buat brand kit. Server lokal ini tidak menjalankan fungsi Gemini atau header Vercel. HTML preview tunggal terpisah dapat dibuka di browser untuk demo lokal.

## GitHub
1. Ekstrak ZIP. Buat repository Public melalui GitHub > New repository, lalu Add file > Upload files.
2. Unggah isi folder proyek, termasuk `api` dan `.gitignore`, ke branch `main`. Commit changes (atau buat branch revisi lalu Pull Request dan merge).
3. Jangan unggah `.env`, token, kunci API atau hasil ekspor berisi data pribadi. Jika secret pernah terlanjur di-commit, segera cabut/rotasi dan bersihkan riwayat.

## Vercel
1. Login Vercel dengan GitHub. Add New > Project > Import repository.
2. Framework/Application Preset: Other. Root Directory: direktori berisi `index.html` dan `vercel.json`. Biarkan build dan output pada default (tanpa build khusus).
3. Deploy. Buka URL HTTPS yang diberikan Vercel. Untuk demo publik, konfigurasi AI dapat dilewati.
4. Untuk Gemini, buat API key di Google AI Studio. Di Vercel Project Settings > Environment Variables, tambahkan `GEMINI_API_KEY`, `GEMINI_MODEL` (ID model teks yang tersedia di AI Studio dan mendukung structured output / generateContent), serta `BRANDIFY_ACCESS_CODE` (kode acak minimal 24 karakter, misalnya `openssl rand -hex 32`). Jangan commit ketiganya. Redeploy.
5. Sebelum membagikan akses AI, batasi kuota/proyek Gemini dan atur rate limit di Vercel Firewall untuk `/api/generate` sesuai dukungan paket. Kode akses hanya dibagikan kepada pengguna tepercaya. Aplikasi tidak memiliki autentikasi per akun atau rate limiter terdistribusi bawaan; jangan membuka akses Gemini untuk semua pengunjung tanpa kontrol ini. Buka Pengaturan AI > Google Gemini, masukkan kode akses dan setujui pemrosesan brief. Kode hanya berada di memori sesi; API key tidak pernah dikirim ke browser.

## Pemeriksaan deployment
Jalankan `curl -I https://DOMAIN-VERCEL-ANDA/` dan `curl -I https://DOMAIN-VERCEL-ANDA/app.js`. Periksa CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff, HSTS max-age=31536000, Referrer-Policy, Permissions-Policy, COOP, CORP. Pastikan tidak ada X-Powered-By atau versi pada Server. Vercel dapat menambahkan Server: Vercel, identitas penyedia tanpa versi; header itu dicadangkan oleh platform. CSP meta tidak bisa menggantikan HSTS, X-Frame-Options, frame-ancestors, COOP, CORP dan header lainnya; GitHub Pages hanya cocok untuk demo jika header wajib tidak dapat dikonfigurasi.

Tailwind menggunakan CSS CDN statis versi 2.2.19, bukan Play CDN yang menjalankan compiler browser. CSS kustom menjaga UI berfungsi jika CDN tidak tersedia. SRI CDN belum diverifikasi; untuk kebijakan supply-chain lebih ketat, kompilasi/pin CSS lokal dan hapus host CDN dari CSP. Uji header dari deployment, cek kontras dan label produk sebelum penggunaan komersial. Belum ada pengujian live Gemini atau deployment dari lingkungan pembuatan ini.

## Redesign UMKM
Salin index.html, style.css, app.js, vercel.json, api/generate.js, dan assets/bumi-brew.webp ke repository yang sudah ada. Aset Bumi Brew adalah contoh visual dari referensi desain, bukan hasil AI live. Mode demo tetap menggunakan renderer SVG, dan mode Gemini memakai konfigurasi server yang sama. Timeout browser 65 detik, request AI 50 detik, fungsi Vercel 60 detik. Verifikasi model dan kuota Gemini serta durasi fungsi pada deployment asli; timeout masih mungkin terjadi. Tidak perlu menambah secret ke GitHub. Preview HTML mandiri terpisah hanya untuk demo lokal.
