# Brandify AI

Studio demo berbahasa Indonesia untuk UMKM, startup, dan usaha baru. Buka pratinjau dan mulai dari proyek contoh **Bumi Brew**, atau pilih **Brief merek** untuk membuat identitasmu sendiri. Generator memakai aturan dan template di browser. Nama, bidang usaha, audiens, slogan, serta karakter merek memengaruhi hasilnya.

## Coba aplikasi

- **Langsung dari ZIP** — ekstrak paket, lalu buka `pratinjau/Brandify-AI-Pratinjau.html` di browser modern. Versi satu berkas ini menyematkan seluruh aset dan dapat dipakai luring. Nama dan slogan pada brief boleh dikosongkan untuk memperoleh usulan otomatis.
- **Jalankan sumber multi-file** — dari folder yang memuat `index.html`, jalankan `python -m http.server 8000 --bind 127.0.0.1`, lalu buka `http://127.0.0.1:8000`. Distribusi utama menggunakan HTTP lokal atau HTTPS agar ekspor gambar memiliki origin yang konsisten.
- **Google AI Studio / Canvas** — gunakan HTML satu berkas untuk pratinjau yang menerima dokumen HTML lengkap. Gunakan sumber multi-file untuk mengedit aplikasi atau menayangkannya di Vercel.

## Di dalam studio

| Menu | Hasil |
| --- | --- |
| Generator logo | Enam komposisi, dua belas simbol, beberapa putaran variasi, unduhan SVG dan PNG transparan. |
| Nama & slogan | Tiga usulan per putaran berdasarkan brief. Terapkan nama dan slogan sekaligus, pilih slogan saja, atau ubah salah satu dari enam gaya huruf. |
| Palet warna | Sepuluh palet lima warna, rekomendasi menurut karakter merek, peran warna, dan salin kode HEX. |
| Mockup produk | Pouch, gelas, kotak, kaus, tote bag, dan botol pump. Pilih sablon, label warna, atau stempel. Ekspor adegan produk atau papan presentasi. Papan kaus memperlihatkan depan dan belakang. |
| Konten Instagram | Tiga konsep per putaran, simulasi feed dan grid profil, caption, foto produk opsional, serta unduhan PNG 1080 × 1350. |
| Analisis merek | Pemeriksaan nama, slogan, deskripsi audiens, rasio kontras, dan arahan gaya komunikasi. |
| Panduan merek | HTML mandiri dengan gambar tertanam serta tampilan cetak A4. Pilih **Cetak / PDF → Simpan sebagai PDF** untuk mendapatkan PDF. |

Pilihan merek tersimpan pada browser dan origin yang sama. Foto produk dan interaksi simulasi berada dalam memori selama sesi. Menyukai, mengomentari, atau menyimpan contoh postingan hanya mengubah pratinjau lokal. Foto unggahan dibatasi hingga 5 MB dan 24 megapiksel, diperiksa format dan dimensinya, lalu dirasterisasi sebelum dipakai.

## Struktur paket

| Berkas | Peran |
| --- | --- |
| `index.html` | Kerangka halaman, navigasi, viewport, ikon, serta kebijakan CSP melalui meta. |
| `style.css` | Tata letak responsif, tampilan studio dan Instagram, gaya dialog dan cetak. |
| `app.js` | Interaksi, validasi formulir, render DOM dengan `textContent`, penyimpanan pilihan, dan ekspor panduan. |
| `catalog.js` | Aturan generator, rekomendasi nama, huruf, palet, dan analisis. |
| `artwork.js` | Komposisi vektor, pengolahan foto lokal, serta ekspor SVG dan PNG. |
| `vercel.json` | Enam header keamanan dan dua header isolasi untuk seluruh rute. |
| `assets/` dan `licenses/` | Foto mockup, ilustrasi, font lokal, dan lisensi font. |
| `.gitignore` dan `.vercelignore` | Pengecualian berkas lokal, rahasia, dan materi yang tidak perlu ditayangkan. |
| `pratinjau/` | Versi portabel yang dapat dibuka langsung. |

## Simpan ke GitHub

1. Ekstrak ZIP. Buka GitHub, pilih **New repository**, beri nama misalnya `brandify-ai-demo`, pilih **Public**, lalu **Create repository**.
2. Pilih **Add file → Upload files** (pada repo kosong, **uploading an existing file**). Unggah berkas dan folder hasil ekstraksi sehingga `index.html` dan `vercel.json` berada di root. Sertakan kedua berkas pengecualian yang namanya diawali titik. Lewati folder `pratinjau/` jika hanya memerlukan situs multi-file.
3. Periksa daftar perubahan. Keluarkan `.env`, `.env.*`, kunci, token, dan kredensial. Pengunggah web tetap mengikutkan berkas yang dipilih secara manual. Studio berfungsi tanpa variabel rahasia.
4. Pilih **Commit changes** ke branch `main`. Jika menggunakan branch revisi, buat Pull Request menuju `main`, periksa perubahannya, lalu merge.

## Deploy ke Vercel

1. Masuk ke Vercel menggunakan GitHub. Pilih **Add New… → Project**.
2. Impor repository dan pilih **Application Preset / Framework Preset → Other**. Gunakan folder yang memuat `index.html` sebagai Root Directory. Biarkan Build Command kosong. Untuk paket ini, output adalah root `.` jika dashboard meminta lokasi.
3. Pilih **Deploy**. Setelah status **Ready**, buka domain produksi HTTPS. Buka satu mockup dan unduh satu PNG untuk memeriksa hasil dari domain baru.
4. Dari terminal, gunakan `curl -sSI https://DOMAIN-PRODUKSI` dengan domain yang diberikan Vercel. Periksa header di bawah pada respons halaman produksi.

## Konfigurasi keamanan

| Header | Nilai atau perilaku |
| --- | --- |
| Content-Security-Policy | Bawaan ditolak, skrip hanya dari origin sendiri, stylesheet CDN diizinkan pada satu path yang dipatok dan dilindungi SRI. Koneksi API, objek, frame anak, skrip dan gaya atribut ditolak. Di header HTTP, `frame-ancestors 'none'` mencegah penyematan. |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | Kamera, mikrofon, geolokasi, pembayaran, USB, dan fitur perangkat lain dinonaktifkan. |
| Cross-Origin-Opener-Policy | `same-origin` |
| Cross-Origin-Resource-Policy | `same-origin` |

Tailwind dimuat sebagai CSS statis terkompilasi dari CDN. Semua fungsi dan gaya pokok tersedia di proyek. Mode demo tidak mengirim brief atau foto ke layanan AI. Pada versi luring, hash SHA-256 mengizinkan hanya blok kode dan CSS yang disertakan.

Aplikasi berupa aset statis dan tidak menambahkan `X-Powered-By` atau versi server. Vercel dapat mengirim `Server: Vercel` sebagai identitas infrastruktur tanpa nomor versi. Pada hosting seperti GitHub Pages, CSP meta tetap tersedia. HSTS, proteksi penyematan, dan header isolasi memerlukan dukungan respons HTTP dari penyedia. Pengaturan frame pada produksi mengharuskan situs dibuka di tab tersendiri.

Dokumentasi resmi — [GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository), [impor Git di Vercel](https://vercel.com/docs/git), [konfigurasi Vercel](https://vercel.com/docs/project-configuration/vercel-json), [header Vercel](https://vercel.com/docs/headers/response-headers), [CSP frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors), [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn).

