# Basa Bali Wiki API (Scraper)

![Lisensi MIT](https://img.shields.io/badge/License-MIT-blue.svg) ![Node.js](https://img.shields.io/badge/Node.js-18.x+-brightgreen.svg) ![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg)

API tidak resmi (unofficial) berbasis Node.js untuk mendapatkan definisi kata dan daftar indeks dari kamus online [BASAbaliWiki](https://dictionary.basabali.org/). API ini dibangun dengan melakukan *web scraping* secara *real-time* ke situs sumber.

## Fitur Utama

- ✅ **Definisi Kata Lengkap**: Ambil detail definisi, tingkatan bahasa (`sor-singgih`), dialek, dan contoh kalimat.
- ✅ **Indeks Kata A-Z**: Dapatkan daftar kata berdasarkan huruf awal.
- ✅ **Arsitektur Bersih**: Dibangun dengan pola desain berlapis (Routes, Controllers, Services) untuk kemudahan pemeliharaan.
- ✅ **Desain RESTful**: Endpoint yang bersih dan intuitif, memisahkan sumber daya `kata` dan `indeks`.
- ✅ **Penanganan Error**: Respons error yang informatif dan konsisten.

> **⚠️ Peringatan**: API ini bergantung pada struktur HTML dari situs `dictionary.basabali.org`. Jika situs sumber mengubah layout-nya, API ini mungkin akan mengalami kegagalan. Gunakan dengan bijak.

## Daftar Isi

- [Instalasi](#instalasi)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Dokumentasi Endpoint API](#dokumentasi-endpoint-api)
  - [Sumber Daya: Kata](#sumber-daya-kata)
  - [Sumber Daya: Indeks](#sumber-daya-indeks)
- [Contoh Respons](#contoh-respons)
  - [Respons Sukses (Detail Kata)](#respons-sukses-detail-kata)
  - [Respons Sukses (Daftar Indeks)](#respons-sukses-daftar-indeks)
  - [Respons Gagal (404 Not Found)](#respons-gagal-404-not-found)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Potensi Peningkatan](#potensi-peningkatan)
- [Lisensi](#lisensi)

## Instalasi

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/YudaKusumaID/basa-bali-wiki-api.git
   cd basa-bali-wiki-api
   ```

2. **Instal dependensi proyek:**
   Gunakan `npm` atau `yarn` untuk menginstal semua paket yang dibutuhkan.
   ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan (Environment):**
   Buat file `.env` di direktori root proyek dengan menyalin dari contoh `.env.example` atau buat secara manual.
   ```env
   # Port untuk menjalankan server
   PORT=8080

   # Mode environment: 'development' atau 'production'
   # 'development' akan menampilkan stack trace pada error
   NODE_ENV=development
   ```

## Menjalankan Proyek

- **Mode Development (dengan auto-reload):**
  Mode ini menggunakan `nodemon` untuk secara otomatis me-restart server setiap kali ada perubahan file.
  ```bash
  npm run dev
  ```

- **Mode Produksi:**
  ```bash
  npm start
  ```

Setelah server berjalan, Anda akan melihat pesan di konsol:
```
Server berjalan di http://localhost:8080
```

## Dokumentasi Endpoint API

Semua endpoint berada di bawah base URL: `/api/v1`

### Sumber Daya: Kata

Endpoint ini digunakan untuk mendapatkan detail informasi dari sebuah kata.

#### `GET /api/v1/kata/:nama`

Mengambil detail definisi, tingkatan bahasa, dialek, dan contoh penggunaan untuk sebuah kata.

**Parameter:**
- `nama` (string, required): Kata dalam Bahasa Bali yang ingin dicari. Contoh: `titiang`.

**Contoh Penggunaan (cURL):**
```bash
curl http://localhost:8080/api/v1/kata/titiang
```

**Respons Sukses (200 OK):**
Mengembalikan objek JSON dengan data lengkap tentang kata tersebut. (Lihat [Contoh Respons](#respons-sukses-detail-kata))

**Respons Gagal (404 Not Found):**
Jika kata tidak ditemukan di kamus. (Lihat [Contoh Respons Gagal](#respons-gagal-404-not-found))

### Sumber Daya: Indeks

Endpoint ini digunakan untuk mendapatkan daftar kata yang tersedia di kamus.

#### `GET /api/v1/indeks`

Mengambil daftar gabungan dari semua kata di kamus, dari A hingga Z.

> **⚠️ Catatan Performa**: Endpoint ini melakukan 26 permintaan scraping secara bersamaan ke situs sumber. Panggilan pertama mungkin akan lambat. Sangat disarankan untuk mengimplementasikan caching pada API ini.

**Contoh Penggunaan (cURL):**
```bash
curl http://localhost:8080/api/v1/indeks
```

**Respons Sukses (200 OK):**
Mengembalikan objek JSON yang berisi jumlah total kata dan sebuah array besar berisi semua kata.

#### `GET /api/v1/indeks/:huruf`

Mengambil daftar semua kata yang diawali dengan huruf tertentu, dengan dukungan pagination.

-   **Parameter Path:**
    -   `huruf` (string, required): Satu karakter alfabet (A-Z, tidak case-sensitive) untuk memfilter daftar kata.

-   **Query Parameters (Opsional):**
    -   `page` (number): Nomor halaman yang ingin ditampilkan.
        -   Default: `1`
    -   `limit` (number): Jumlah data per halaman.
        -   Default: `20`
        -   Maksimum: `100`

-   **Contoh Penggunaan (cURL):**
    -   **Halaman pertama (default):**
        ```bash
        curl "http://localhost:3000/api/v1/indeks/a"
        ```
    -   **Halaman kedua dengan 10 item per halaman:**
        ```bash
        curl "http://localhost:3000/api/v1/indeks/a?page=2&limit=10"
        ```

-   **Respons Sukses (200 OK):**
    Mengembalikan objek JSON yang berisi metadata pagination dan daftar kata untuk halaman tersebut.

**Parameter:**
- `huruf` (string, required): Satu karakter alfabet (A-Z, tidak case-sensitive) untuk memfilter daftar kata.

**Contoh Penggunaan (cURL):**
```bash
curl http://localhost:8080/api/v1/indeks/b
```

**Respons Sukses (200 OK):**
Mengembalikan objek JSON yang berisi daftar kata untuk huruf yang diminta. (Lihat [Contoh Respons](#respons-sukses-daftar-indeks))

## Contoh Respons

### Respons Sukses (Detail Kata)

**Permintaan:** `GET /api/v1/kata/titiang`

```json
{
    "success": true,
    "message": "Definisi untuk kata 'titiang' berhasil diambil.",
    "data": {
        "word": "Titiang",
        "definitions": [
            { "lang": "en", "text": "first person singular pronouns" },
            { "lang": "en", "text": "I; me (Alus sor)" },
            { "lang": "id", "text": "saya (Alus sor)" },
            { "lang": "id", "text": "kata ganti orang pertama tunggal" }
        ],
        "speechLevels": [
            { "level": "Kasar", "text": "ake; wake; kola" },
            { "level": "Andap", "text": "cang; icang; dewek; gelah" },
            { "level": "Alus sor", "text": "titiang" },
            { "level": "Alus madya", "text": "tiang" }
        ],
        "dialects": [
            { "dialect": "Bali Dataran", "text": "Oke (Buleleng); Oke (Jembrana, Batur); Kola (Nusa Penida)" }
        ],
        "examples": [
            {
                "balinese": "Titiang sampun iriki.",
                "english": "I am already here.",
                "indonesian": "Saya sudah di sini."
            }
        ]
    }
}
```

### Respons Sukses (Daftar Indeks dengan Pagination)

**Permintaan:** `GET /api/v1/indeks/a?page=1&limit=5`

```json
{
    "success": true,
    "message": "Daftar kata untuk huruf 'A' berhasil diambil.",
    "pagination": {
        "currentPage": 1,
        "totalPages": 165,
        "limit": 5,
        "totalItems": 822,
        "itemsOnPage": 5
    },
    "data": [
        "A",
        "Aa",
        "Aab",
        "Aad",
        "Aag"
    ]
}
```

### Respons Gagal (404 Not Found)

**Permintaan:** `GET /api/v1/kata/katangawag`

```json
{
    "success": false,
    "status": 404,
    "message": "Kata 'katangawag' tidak ditemukan di kamus."
}
```

## Teknologi yang Digunakan

- [Node.js](https://nodejs.org/) - Lingkungan eksekusi JavaScript.
- [Express.js](https://expressjs.com/) - Framework web minimalis untuk Node.js.
- [Axios](https://axios-http.com/) - Klien HTTP berbasis Promise untuk browser dan Node.js.
- [Cheerio](https://cheerio.js.org/) - Implementasi cepat dan fleksibel dari jQuery Core untuk server.
- [Dotenv](https://github.com/motdotla/dotenv) - Memuat variabel lingkungan dari file `.env`.
- [Nodemon](https://nodemon.io/) - Utilitas untuk me-restart server secara otomatis saat pengembangan.

## Struktur Proyek

Proyek ini menggunakan arsitektur berlapis untuk memisahkan tanggung jawab (Separation of Concerns).

```
/src
├── api/
│   └── routes/         # Mendefinisikan endpoint API
├── controllers/        # Mengelola alur request-response
├── services/           # Berisi logika bisnis inti (scraping)
├── utils/              # Utilitas pembantu (e.g., kelas Error)
└── app.js              # Entry point aplikasi & konfigurasi Express
```

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.