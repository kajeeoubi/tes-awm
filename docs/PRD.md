# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Mini E-Commerce & Realtime Dashboard — Sparke

**Nama Proyek:** Sparke — Toko Elektronik & Aksesori Premium  
**Versi Dokumen:** 2.0  
**Tipe Aplikasi:** Fullstack Web Application  
**Target Pengguna:** Pelanggan Toko (*Customer*) & Pengelola Toko (*Administrator*)

---

## 1. Ringkasan Eksekutif (*Executive Summary*)

**Sparke** adalah platform aplikasi e-commerce modern yang dirancang untuk menghadirkan pengalaman belanja elektronik dan aksesori teknologi premium secara cepat, mulus, dan tanpa hambatan registrasi yang rumit bagi pelanggan.

Aplikasi terbagi menjadi dua ekosistem utama:
1. **Customer Storefront & Instant Checkout**: Antarmuka katalog produk berestetika *editorial modern minimalist* (terinspirasi dari template Wix Studio Sparke) yang mendukung pemilihan multi-produk, keranjang belanja interaktif 2 tahap (*2-Step Slide-Over Drawer*), kalkulasi ongkos kirim dinamis berdasarkan alamat pengiriman, penerapan kupon diskon promo, dan pembuatan faktur pesanan instan.
2. **Admin Realtime Dashboard & Management Suite**: Panel kontrol administrator yang terproteksi autentikasi aman, dilengkapi kartu metrik performa (*KPI Metrics*), grafik tren penjualan dinamis (*Recharts*), pemantauan pesanan live tanpa refresh (*Supabase Realtime* dengan audio chime & notifikasi toast), manajemen katalog produk (CRUD), manajemen voucher diskon (CRUD), dan pengaturan profil admin serta keamanan kata sandi.

---

## 2. Tujuan & Nilai Bisnis (*Objectives & Business Value*)

- **Pemesanan Cepat & Fleksibel**: Memungkinkan pelanggan memesan aneka jenis produk dalam kuantitas yang diinginkan secara instan tanpa kewajiban membuat akun terlebih dahulu.
- **Transparansi Biaya & Promosi**: Menyediakan penghitungan otomatis subtotal belanja, ongkos kirim dinamis setelah pengisian alamat, serta validasi kupon promo hemat (`percent`, `fixed`, `shipping`).
- **Monitoring Operasional Realtime**: Memberikan notifikasi audio visual instan kepada administrator setiap kali ada pesanan baru yang masuk ke sistem database.
- **Manajemen Inventaris & Promosi Lengkap**: Menyediakan fitur terpadu bagi admin untuk mengelola etalase produk, kategori Bahasa Indonesia, aturan diskon voucher, dan pembaruan status transaksi pesanan.
- **Estetika & Kenyamanan Pengguna**: Menghadirkan antarmuka minimalis elegan yang 100% responsif di desktop, tablet, dan ponsel pintar.

---

## 3. Cakupan Fitur (*Scope of Work*)

### 3.1 Fitur Pelanggan (*Customer Facing*)
- **Hero & Curated Showcase**: Banner promosi split-screen interaktif, penawaran produk terbaru (*New Arrivals*), dan penawaran khusus (*Special Offers*).
- **Katalog Produk Dinamis**: Penjelajahan produk berdasarkan kategori resmi Bahasa Indonesia (*Aksesori*, *Speaker & Headphone*, *Monitor & Layar*, *Penyimpanan & Memori*, *Perangkat Pintar*) dengan fitur live search.
- **Multi-Product Cart Context**: Penambahan item ke keranjang belanja dengan notifikasi toast bertumpuk (*stacked toasts*), stepper pengatur kuantitas, dan perlindungan batas stok gudang.
- **Slide-Over Drawer 2 Tahap**:
  - *Tahap 1*: Pemeriksaan rincian daftar barang dan subtotal.
  - *Tahap 2*: Formulir identitas pembeli (Nama, No. WhatsApp), Alamat Pengiriman, pemilih kartu kupon promo instan, dan rincian final pembayaran.
- **Faktur Pesanan Sukses**: Halaman konfirmasi pesanan (`/order-success/[orderNumber]`) dengan nomor nota unik, ringkasan transaksi, dan animasi perayaan *confetti*.

### 3.2 Fitur Administrator (*Admin Suite*)
- **Autentikasi & Proteksi Sesi**: Sistem login terenkripsi PBKDF2 SHA-512 dengan session token berbasis cookie aman (*HttpOnly*), serta opsi *Demo Quick Access*.
- **Dashboard Ringkasan Realtime (`/admin`)**:
  - Kartu KPI: Total Penjualan (Revenue), Total Pesanan Masuk, Produk Terjual, dan Rata-rata Nilai Transaksi (AOV).
  - Grafik Penjualan Interaktif (*Recharts Area & Bar Chart*).
  - Tabel Pesanan Terbaru dengan status live.
  - Notifikasi Suara (*Web Audio Chime*) & Sonner Toast saat pesanan baru masuk secara realtime.
- **Manajemen Pesanan (`/admin/orders`)**:
  - Daftar transaksi lengkap dengan pencarian nomor pesanan, filter status (*Semua*, *Pending*, *Diproses*, *Selesai*, *Dibatalkan*), modal rincian barang, dan pengubah status transaksi.
- **Manajemen Katalog Produk (`/admin/products`)**:
  - Penambahan produk baru (`/admin/products/new`) dan pengubahan produk (`/admin/products/[id]`).
  - Pemilihan kategori terstandarisasi menggunakan Dropdown Menu Base UI yang bersih dan seragam.
- **Manajemen Voucher & Promo (`/admin/vouchers`)**:
  - Pembuatan dan pengeditan kupon promo (`percent`, `fixed`, `shipping`) beserta batas minimum belanja dan status aktif/nonaktif.
- **Pengaturan Akun Admin (`/admin/settings`)**:
  - Pembaruan nama lengkap, alamat email login, foto avatar, serta penggantian kata sandi akun administrator secara aman dengan sinkronisasi langsung ke sidebar.

---

## 4. Kebutuhan Fungsional (*Functional Requirements*)

| Kode | Nama Fitur | Deskripsi Fungsional |
|---|---|---|
| **FR-01** | *Product Catalog* | Menampilkan data produk dari Supabase PostgreSQL dengan foto, nama, kategori, deskripsi, harga, dan stok. |
| **FR-02** | *Search & Category Filter* | Memfilter katalog secara instan berdasarkan kata kunci dan kategori resmi Bahasa Indonesia. |
| **FR-03** | *Multi-Product Cart* | Mendukung penyimpanan banyak varian produk dengan penyesuaian kuantitas secara realtime via React Context. |
| **FR-04** | *Instant Checkout* | Memfasilitasi pembelian tanpa registrasi akun, memvalidasi nomor WhatsApp, dan menghimpun alamat pengiriman. |
| **FR-05** | *Dynamic Shipping & Voucher* | Menghitung ongkos kirim standar setelah pengisian alamat dan memotong tagihan sesuai skema diskon kupon aktif. |
| **FR-06** | *Stock Auto-Deduction* | Mengurangi kuantitas stok produk pada database secara otomatis setiap kali pesanan berhasil dikonfirmasi. |
| **FR-07** | *Unique Order ID* | Menghasilkan kode nota unik berformat `ORD-YYYYMMDD-XXXX` untuk pelacakan transaksi. |
| **FR-08** | *Realtime Supabase Sync* | Memanfaatkan PostgreSQL CDC (*Change Data Capture*) via Supabase Realtime channel untuk memperbarui data dashboard secara instan tanpa polling. |
| **FR-09** | *Realtime Alert & Chime* | Memainkan audio nada *chime* Web Audio API dan menampilkan pop-up toast saat pesanan baru diterima. |
| **FR-10** | *Admin Overview & Charts* | Menyajikan agregasi metrik pendapatan, volume order, dan grafik tren visual dengan Recharts. |
| **FR-11** | *Order Status Workflow* | Memperbarui status pesanan (*Pending* &rarr; *Processing* &rarr; *Completed* / *Cancelled*) secara langsung ke database. |
| **FR-12** | *Product CRUD* | Menambah, mengubah, dan menghapus master produk etalase dengan validasi input dan pemilihan kategori standar. |
| **FR-13** | *Voucher CRUD* | Mengelola kode promo, tipe diskon (persen, nominal tetap, bebas ongkir), batas minimal belanja, dan status aktif. |
| **FR-14** | *Admin Profile Management* | Memperbarui identitas administrator (nama, email, avatar) dan mengubah kata sandi akun yang terenkripsi. |
| **FR-15** | *100% Indonesian Copy* | Seluruh teks antarmuka, label input, notifikasi, dan pesan error menggunakan Bahasa Indonesia yang natural dan ramah pengguna. |

---

## 5. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)

- **Performa & Reaktivitas**: Pemuatan halaman instan dengan Server-Side Rendering (SSR) Next.js App Router, caching query TanStack Query, dan pembaruan mutasi optimistik.
- **Keamanan Data**:
  - Enkripsi kata sandi menggunakan algoritma **PBKDF2 SHA-512** dengan salt unik acak.
  - Sesi login dilindungi token terenkripsi HMAC SHA-256 pada cookie *HttpOnly* dan *SameSite: Lax*.
  - Aturan *Row Level Security (RLS)* terkonfigurasi pada Supabase PostgreSQL.
- **Desain Responsif & Aksesibilitas**: Tata letak fleksibel untuk semua resolusi (Desktop 1920px hingga Mobile 360px), penanda visual fokus yang lembut, dan kontras warna yang nyaman di mata.
- **Konsistensi UI/UX**: Seluruh komponen form, input teks, tombol aksi, dan dropdown menu menggunakan standar token desain yang seragam (`bg-neutral-50/50`, `rounded-xl`, `text-xs font-normal`).

---

## 6. Arsitektur Teknologi (*Technology Stack*)

- **Framework Web**: Next.js 16 (App Router, Turbopack)
- **Bahasa Pemrograman**: TypeScript (Strict Mode)
- **Styling & CSS**: Tailwind CSS v4 & Lucide React Icons
- **Komponen Primitif**: Base UI (`@base-ui/react`) & shadcn UI
- **Database & Realtime**: Supabase (PostgreSQL 15+, Database Replication, Realtime Engine)
- **State Management & Query**: React Context API, TanStack React Query
- **Visualisasi & Animasi**: Recharts, Canvas Confetti, Sonner Toast
- **Deployment Platform**: Vercel Cloud Platform