# AGENTS.md

Panduan untuk agen AI yang bekerja di repositori undangan pernikahan statis ini.

## Ringkasan proyek

- **Aplikasi utama:** `wedding-azki-rein/` — undangan digital Azki & Rein (HTML/CSS/JS vanilla).
- **Varian lama:** `index.html` di root — undangan Rizky & Nadia (tanpa backend eksternal).
- **Tooling opsional:** `rebuild_absolute.ps1` menggabungkan `new_style.css` + `new_body.html` ke `wedding-azki-rein/index.html`.

Tidak ada `package.json`, Docker, Makefile, atau runner tes/lint di repo.

## Perintah pengembangan

| Tugas | Perintah |
|-------|----------|
| **Jalankan (dev)** | `cd wedding-azki-rein && python3 -m http.server 8080` |
| **URL contoh** | `http://localhost:8080/?untuk=Nama%20Tamu` |
| **Lint / test / build** | Tidak dikonfigurasi di repo |

Parameter query `untuk` atau `to` mempersonalisasi nama tamu di cover.

## Layanan eksternal (opsional untuk E2E penuh)

- **Google Apps Script** — RSVP dan daftar ucapan (`fetch` dari `wedding-azki-rein/index.html`).
- **Google Fonts CDN** — tipografi (fallback sistem jika offline).
- **Audio** — default dari GitHub raw; file `musik.mp3` ada di root repo jika ingin di-host lokal.

## Cursor Cloud specific instructions

- **Update script VM** tidak menginstal dependensi — situs statis murni; cukup pastikan Python 3 tersedia untuk `http.server`.
- **Jangan** buka undangan lewat `file://`; gunakan server HTTP agar asset relatif dan perilaku browser (audio, fetch) konsisten.
- **Server dev:** dari direktori `wedding-azki-rein`, jalankan `python3 -m http.server 8080` (atau port lain). Untuk root `index.html`, serve dari `/workspace` dengan perintah yang sama.
- **tmux:** untuk sesi server jangka panjang, gunakan sesi bernama misalnya `wedding-static-server` agar mudah di-attach ulang.
- **Alur inti untuk verifikasi:** buka `/?untuk=...` → klik **Buka Undangan** → navigasi ke RSVP → submit form. Backend Google Apps Script membutuhkan jaringan keluar; tanpa itu UI tetap berjalan, submit RSVP tidak tersimpan di server.
- **Rebuild HTML:** `rebuild_absolute.ps1` membutuhkan PowerShell (`pwsh`); `rebuild.py` / `rebuild.ps1` mengharapkan folder `scratch/` yang tidak ada di repo — gunakan `rebuild_absolute.ps1` untuk rebuild yang valid.
