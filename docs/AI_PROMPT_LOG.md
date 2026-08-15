# AI Prompting Documentation Log

## Mini E-Commerce & Realtime Dashboard — Sparke

Dokumen ini mencatat riwayat terstruktur interaksi *prompting* dengan AI Coding Assistant selama proses perancangan, arsitektur data, implementasi fitur, hingga penyempurnaan UI/UX aplikasi **Sparke**.

---

### Log 01 — Analisis Kebutuhan Teknis & Perencanaan Arsitektur Proyek
- **Prompt:**
  `"Analisis kebutuhan aplikasi mini e-commerce dengan guest checkout instan dan admin realtime dashboard berdasarkan dokumen PRD. Petakan arsitektur Next.js App Router, skema database Supabase PostgreSQL, dependensi library, dan integrasi realtime yang optimal."`
- **Tujuan:**
  Membedah seluruh spesifikasi teknis dan merumuskan checklist arsitektur sistem, struktur folder, kontrak API, serta alur data antara antarmuka pelanggan dan dashboard pengelola.
- **Hasil yang Dihasilkan AI:**
  Dokumen arsitektur teknis mencakup pemetaan dependensi (`@supabase/supabase-js`, `recharts`, `lucide-react`, `sonner`, `canvas-confetti`, `@tanstack/react-query`), skema relasi tabel, dan rencana implementasi bertahap.
- **Perubahan yang Dilakukan:**
  Inisialisasi repositori proyek, pembuatan file `.env.example`, dan penyusunan folder dasar `src/`.
- **Evaluasi / Validasi:**
  Arsitektur yang direncanakan 100% selaras dengan standar modern Next.js 16 dan siap diimplementasikan.

---

### Log 02 — Perancangan Skema Database PostgreSQL, Relasi Data, & RLS Supabase
- **Prompt:**
  `"Buatkan file SQL migration skema database Supabase PostgreSQL yang idempotent untuk aplikasi Sparke. Sediakan tabel products, vouchers, orders, order_items, dan admins lengkap dengan primary key UUID, foreign key constraint (cascade/restrict), Row Level Security (RLS), Supabase Realtime publication, serta seed data awal."`
- **Tujuan:**
  Menyusun struktur database relasional yang kuat, aman, dan siap menerima transaksi live dari antarmuka web.
- **Hasil yang Dihasilkan AI:**
  File `supabase/schema.sql` yang memuat definisi 5 tabel utama, kebijakan RLS, replikasi Supabase Realtime untuk semua tabel, dan seed data produk, voucher, serta akun admin default.
- **Perubahan yang Dilakukan:**
  Eksekusi migrasi database ke cloud Supabase dan pembuatan file client helper `src/lib/supabase/client.ts` serta `src/lib/supabase/server.ts`.
- **Evaluasi / Validasi:**
  Seluruh tabel, relasi referensial, dan fungsi realtime berhasil diuji dan aktif pada PostgreSQL Supabase.

---

### Log 03 — Setup Antarmuka Dasar, Desain System, & Komponen UI Primitif
- **Prompt:**
  `"Konfigurasikan sistem antarmuka berbasis Tailwind CSS v4 dan Base UI. Buat komponen reusable seperti button, card, input, label, badge, sheet, dialog, dan dropdown-menu dengan styling konsisten berestetika modern minimalis."`
- **Tujuan:**
  Menyediakan fondasi desain yang seragam, ringan, dan mudah digunakan kembali di seluruh halaman aplikasi.
- **Hasil yang Dihasilkan AI:**
  Kumpulan komponen UI pada `src/components/ui/` dengan token warna yang bersih, radius membulat `rounded-xl`, dan transisi interaksi yang halus.
- **Perubahan yang Dilakukan:**
  Pembaruan pada `src/app/globals.css`, `src/lib/utils.ts`, dan direktori `src/components/ui/`.
- **Evaluasi / Validasi:**
  Komponen UI terintegrasi mulus tanpa konflik styling dan mendukung mode terang/gelap.

---

### Log 04 — Perancangan Halaman Utama Storefront (Inspirasi Editorial Wix Studio Sparke)
- **Prompt:**
  `"Rancang halaman utama toko online berkonsep Modern Minimalist Tech Editorial terinspirasi dari template Wix Studio Sparke. Strukturkan menjadi Hero Split-Screen dengan New Arrivals, Shop by Category, Special Offers, Banners Promosi, dan Interactive Product Catalog."`
- **Tujuan:**
  Menciptakan kesan visual pertama yang premium, elegan, dan profesional layaknya brand retail elektronik ternama.
- **Hasil yang Dihasilkan AI:**
  Tata letak halaman beranda di [`src/app/page.tsx`](file:///c:/laragon/www/tes-awm/src/app/page.tsx) dengan kartu produk rasio 4:5, tipografi bersih, badge ketersediaan stok, dan banner promosi yang menawan.
- **Perubahan yang Dilakukan:**
  Pembuatan komponen [`navbar.tsx`](file:///c:/laragon/www/tes-awm/src/components/navbar.tsx), [`product-card.tsx`](file:///c:/laragon/www/tes-awm/src/components/product-card.tsx), [`product-grid.tsx`](file:///c:/laragon/www/tes-awm/src/components/product-grid.tsx), dan seksi penunjang di `src/components/home/`.
- **Evaluasi / Validasi:**
  Desain tampil proporsional, rapi, dan responsif di resolusi desktop maupun layar sentuh mobile.

---

### Log 05 — Implementasi Multi-Product Cart Context & Stepper Kuantitas
- **Prompt:**
  `"Buatkan CartContext di React untuk mengelola keranjang belanja multi-produk. Sediakan fungsi penambahan barang dengan notifikasi toast bertumpuk, pengurangan, penghapusan, dan stepper kuantitas dengan validasi stok maksimal gudang."`
- **Tujuan:**
  Menyediakan manajemen state global yang reaktif untuk menangani operasi keranjang belanja pelanggan dari berbagai bagian halaman.
- **Hasil yang Dihasilkan AI:**
  File [`src/context/cart-context.tsx`](file:///c:/laragon/www/tes-awm/src/context/cart-context.tsx) dengan persistensi local storage, kalkulasi total kuantitas, dan perlindungan agar pembelian tidak melampaui batas stok yang tersedia.
- **Perubahan yang Dilakukan:**
  Pembungkusan root provider di `src/app/layout.tsx` dan integrasi tombol aksi pada kartu produk.
- **Evaluasi / Validasi:**
  Pengujian penambahan aneka produk berjalan lancar, counter badge pada navbar terupdate otomatis, dan pembatasan stok bekerja akurat.

---

### Log 06 — Alur Checkout Instan 2-Step Slide-Over Drawer
- **Prompt:**
  `"Ubah alur checkout keranjang menjadi 2-Step Slide-Over Drawer: Langkah 1 untuk review daftar item belanja & subtotal, dan Langkah 2 untuk pengisian formulir pemesan (Nama, No. WhatsApp, Alamat Pengiriman, dan Voucher Promo)."`
- **Tujuan:**
  Meningkatkan fokus dan kenyamanan belanja pelanggan melalui pemisahan tahap peninjauan keranjang dan pengisian data checkout.
- **Hasil yang Dihasilkan AI:**
  Komponen [`src/components/cart-drawer.tsx`](file:///c:/laragon/www/tes-awm/src/components/cart-drawer.tsx) dengan transisi mulus antar langkah, tombol kembali, dan validasi data input.
- **Perubahan yang Dilakukan:**
  Restrukturisasi alur checkout pada drawer samping keranjang belanja.
- **Evaluasi / Validasi:**
  Alur belanja terasa sangat intuitif, cepat, dan tidak membingungkan pengguna baru.

---

### Log 07 — Integrasi Ongkos Kirim Dinamis & Mesin Validasi Kupon Diskon
- **Prompt:**
  `"Tambahkan kalkulasi ongkos kirim dinamis yang otomatis aktif saat alamat pengiriman selesai diisi, serta sediakan selector kartu voucher promo (seperti GRATISONGKIR, SPARKE10, HEMAT50) yang langsung memotong tagihan pembayaran secara realtime."`
- **Tujuan:**
  Memberikan transparansi biaya kirim dan daya tarik promosi diskon yang langsung terlihat pada rincian pembayaran sebelum pemesanan disubmit.
- **Hasil yang Dihasilkan AI:**
  Fitur kalkulasi otomatis pada drawer checkout: ongkos kirim berstatus tanda strip (`-`) sebelum alamat diisi, lalu otomatis terhitung Rp 20.000 (atau Rp 0 jika menggunakan kupon Bebas Ongkir), serta pemotongan diskon persen/nominal yang akurat.
- **Perubahan yang Dilakukan:**
  Pembaruan pada [`src/components/cart-drawer.tsx`](file:///c:/laragon/www/tes-awm/src/components/cart-drawer.tsx).
- **Evaluasi / Validasi:**
  Perhitungan subtotal, diskon voucher, ongkir, dan total akhir terbukti 100% presisi dalam berbagai skenario transaksi.

---

### Log 08 — Halaman Faktur Pesanan Sukses & Pengurangan Stok Otomatis
- **Prompt:**
  `"Buatkan halaman konfirmasi pesanan sukses (/order-success/[orderNumber]) yang menampilkan faktur nota pembayaran unik, rincian barang yang dibeli, alamat pengiriman, status pesanan, dan animasi perayaan confetti."`
- **Tujuan:**
  Memberikan kepastian transaksi yang memuaskan bagi pelanggan setelah berhasil memesan barang.
- **Hasil yang Dihasilkan AI:**
  Halaman [`src/app/order-success/[orderNumber]/page.tsx`](file:///c:/laragon/www/tes-awm/src/app/order-success/[orderNumber]/page.tsx) dengan tata letak invoice rapi, tombol lanjut belanja, dan efek partikel confetti yang meriah.
- **Perubahan yang Dilakukan:**
  Implementasi server fetching detail pesanan berdasarkan nomor order unik serta logika pengurangan stok otomatis di database saat transaksi masuk.
- **Evaluasi / Validasi:**
  Nomor order unik `ORD-YYYYMMDD-XXXX` berhasil diterbitkan dan stok produk di database berkurang sesuai jumlah yang dipesan.

---

### Log 09 — Proteksi Realtime Concurrency & Isolasi Channel Supabase
- **Prompt:**
  `"Atasi runtime error 'cannot add postgres_changes callbacks for realtime channel after subscribe()' pada custom hook useProducts, useVouchers, dan useOrders dengan memberikan identifier channel acak unik per instance."`
- **Tujuan:**
  Mencegah tabrakan nama subscription channel Supabase pada React Strict Mode dan komponen yang me-mount hook secara bersamaan.
- **Hasil yang Dihasilkan AI:**
  Pembaruan pada [`src/hooks/use-products.ts`](file:///c:/laragon/www/tes-awm/src/hooks/use-products.ts), [`src/hooks/use-orders.ts`](file:///c:/laragon/www/tes-awm/src/hooks/use-orders.ts), dan [`src/hooks/use-vouchers.ts`](file:///c:/laragon/www/tes-awm/src/hooks/use-vouchers.ts) dengan format nama channel dinamis `realtime_table_${Math.random().toString(36).substring(2, 9)}`.
- **Perubahan yang Dilakukan:**
  Penyempurnaan mekanisme cleanup `supabase.removeChannel()` saat komponen di-unmount.
- **Evaluasi / Validasi:**
  Error runtime tereliminasi sepenuhnya dan pembaruan realtime berjalan stabil tanpa kebocoran memori (*memory leak*).

---

### Log 10 — Realtime Admin Dashboard Overview dengan KPI Metrics & Recharts
- **Prompt:**
  `"Bangun dashboard utama admin (/admin) dengan kartu metrik performa (Total Revenue, Total Pesanan, Produk Terjual, Average Order Value), grafik tren penjualan interaktif menggunakan Recharts, tabel pesanan terkini, serta notifikasi Web Audio chime saat ada pesanan baru."`
- **Tujuan:**
  Menyediakan pusat kendali komprehensif bagi pengelola toko untuk memantau performa penjualan secara instan dan live.
- **Hasil yang Dihasilkan AI:**
  Halaman [`src/app/admin/page.tsx`](file:///c:/laragon/www/tes-awm/src/app/admin/page.tsx) yang terhubung ke data real Supabase dengan visualisasi grafik area & bar chart, indikator perubahan persentase, dan audio alert chime otomatis.
- **Perubahan yang Dilakukan:**
  Integrasi modul ringkasan data penjualan dan pendengar event realtime transaksi.
- **Evaluasi / Validasi:**
  Saat ada transaksi baru dari storefront, kartu KPI dan grafik Recharts langsung terupdate tanpa perlu reload halaman.

---

### Log 11 — Manajemen Pesanan & Pembaruan Status Alur Kerja
- **Prompt:**
  `"Kembangkan modul manajemen pesanan (/admin/orders) dengan fitur pencarian nomor pesanan/nama pembeli, filter status pesanan (Semua, Pending, Diproses, Selesai, Dibatalkan), modal detail rincian produk, dan pengubah status transaksi live."`
- **Tujuan:**
  Memudahkan admin memproses setiap pesanan masuk mulai dari verifikasi hingga pengiriman selesai.
- **Hasil yang Dihasilkan AI:**
  Halaman [`src/app/admin/orders/page.tsx`](file:///c:/laragon/www/tes-awm/src/app/admin/orders/page.tsx) dengan tabel pesanan responsif, lencana status berwarna, dan integrasi mutasi update status ke database.
- **Perubahan yang Dilakukan:**
  Pembuatan antarmuka filter dan modal rincian order lengkap dengan riwayat item yang dibeli.
- **Evaluasi / Validasi:**
  Perubahan status berhasil tersimpan ke database Supabase dan langsung terdistribusi ke seluruh subscriber realtime.

---

### Log 12 — Manajemen Master Produk dengan Standardisasi Kategori Bahasa Indonesia
- **Prompt:**
  `"Buatkan halaman CRUD produk (/admin/products, /admin/products/new, dan /admin/products/[id]) dengan opsi kategori resmi Bahasa Indonesia (Aksesori, Speaker & Headphone, Monitor & Layar, Penyimpanan & Memori, Perangkat Pintar) menggunakan Dropdown Menu Base UI yang bersih."`
- **Tujuan:**
  Menyediakan sarana pengelolaan etalase produk toko dengan kategorisasi yang terstandarisasi dan tampilan dropdown form yang rapi.
- **Hasil yang Dihasilkan AI:**
  Komponen [`new-product-view.tsx`](file:///c:/laragon/www/tes-awm/src/components/admin/products/new-product-view.tsx) dan [`edit-product-view.tsx`](file:///c:/laragon/www/tes-awm/src/components/admin/products/edit-product-view.tsx) dengan dropdown menu melayang, tanda centang aktif, dan validasi form terpadu.
- **Perubahan yang Dilakukan:**
  Standardisasi array `PRODUCT_CATEGORIES` di `src/types/ecommerce.ts` dan migrasi nama kategori di database.
- **Evaluasi / Validasi:**
  Admin dapat menambah dan mengubah data produk dengan kategori Bahasa Indonesia yang sinkron langsung ke halaman utama toko.

---

### Log 13 — Manajemen Voucher & Skema Potongan Diskon Promosi
- **Prompt:**
  `"Bangun modul manajemen voucher (/admin/vouchers) yang mendukung pembuatan dan pengeditan kupon promo dengan skema diskon persentase, nominal tetap, maupun bebas ongkir, serta pengaturan batas minimum belanja dan status aktif."`
- **Tujuan:**
  Memberikan fleksibilitas penuh bagi admin untuk mengatur program promosi dan kampanye diskon toko.
- **Hasil yang Dihasilkan AI:**
  Komponen [`new-voucher-view.tsx`](file:///c:/laragon/www/tes-awm/src/components/admin/vouchers/new-voucher-view.tsx) dan [`edit-voucher-view.tsx`](file:///c:/laragon/www/tes-awm/src/components/admin/vouchers/edit-voucher-view.tsx) dengan Dropdown Menu untuk jenis diskon dan status voucher yang tertata rapi secara sejajar.
- **Perubahan yang Dilakukan:**
  Penyelarasan layout grid formulir voucher dan penambahan endpoint API mutasi voucher.
- **Evaluasi / Validasi:**
  Voucher baru yang dibuat admin langsung dapat digunakan oleh customer pada saat checkout.

---

### Log 14 — Pengaturan Akun Admin & Keamanan Ganti Kata Sandi (PBKDF2 SHA-512)
- **Prompt:**
  `"Ganti menu Superadmin pada dropdown sidebar menjadi Pengaturan Akun. Buatkan halaman /admin/settings untuk memperbarui nama lengkap, email, foto avatar, serta keamanan penggantian kata sandi dengan enkripsi PBKDF2 SHA-512 yang tersinkronisasi realtime ke sidebar."`
- **Tujuan:**
  Menyediakan pengelolaan profil admin yang aman dan memungkinkan pengubahan kredensial login tanpa perlu akses langsung ke database console.
- **Hasil yang Dihasilkan AI:**
  Endpoint API [`/api/admin/profile`](file:///c:/laragon/www/tes-awm/src/app/api/admin/profile/route.ts), komponen [`account-settings-view.tsx`](file:///c:/laragon/www/tes-awm/src/components/admin/settings/account-settings-view.tsx), dan pembaruan pada [`app-sidebar.tsx`](file:///c:/laragon/www/tes-awm/src/components/admin/layout/app-sidebar.tsx).
- **Perubahan yang Dilakukan:**
  Implementasi verifikasi password lama sebelum hashing kata sandi baru, pembaruan cookie sesi terenkripsi, dan dispatch event `sparke:admin-profile-updated`.
- **Evaluasi / Validasi:**
  Data profil dan inisial/avatar di sidebar langsung terupdate secara instan setelah disimpan tanpa perlu me-refresh browser.

---

### Log 15 — Standardisasi Keseragaman Gaya Desain, Tipografi, & Form Input
- **Prompt:**
  `"Seragamkan seluruh gaya font, ketebalan, dan estetika elemen form di seluruh halaman aplikasi: pastikan seluruh placeholder menggunakan ketebalan normal (font-normal), seluruh input memiliki ukuran text-xs font-normal dengan background bg-neutral-50/50 dan sudut rounded-xl."`
- **Tujuan:**
  Menghilangkan inkonsistensi visual pada formulir dan menjaga estetika antarmuka tetap rapi, bersih, dan berkelas tinggi.
- **Hasil yang Dihasilkan AI:**
  Pembaruan kelas bawaan pada [`src/components/ui/input.tsx`](file:///c:/laragon/www/tes-awm/src/components/ui/input.tsx), form produk admin, form voucher, dan form checkout.
- **Perubahan yang Dilakukan:**
  Penetapan global `placeholder:font-normal placeholder:text-muted-foreground` dan harmonisasi seluruh kontainer input.
- **Evaluasi / Validasi:**
  Semua form input kini tampil 100% konsisten, proporsional, dan sangat sedap dipandang.

---

### Log 16 — Lokalisasi Penuh Bahasa Indonesia & Copywriting E-Commerce Alami
- **Prompt:**
  `"Pastikan seluruh bahasa antarmuka di customer storefront dan admin dashboard menggunakan Bahasa Indonesia yang natural, profesional, dan elegan. Hilangkan seluruh istilah teknis pengujian sehingga aplikasi tampil otentik layaknya toko e-commerce resmi."`
- **Tujuan:**
  Menghadirkan pengalaman pengguna lokal yang ramah, nyaman dipahami, dan berstandar komersial tinggi.
- **Hasil yang Dihasilkan AI:**
  Pembersihan teks di seluruh komponen navbar, hero, kategori, drawer, invoice sukses, dan panel admin menjadi Bahasa Indonesia baku yang komunikatif.
- **Perubahan yang Dilakukan:**
  Penyelarasan label tombol, notifikasi toast, pesan error validasi, dan footer informasi toko.
- **Evaluasi / Validasi:**
  Seluruh konten website terbaca alami, konsisten, dan siap digunakan oleh publik.

---

### Log 17 — Verifikasi Kualitas Kode TypeScript & Validasi Build Produksi
- **Prompt:**
  `"Jalankan pemeriksaan typecheck TypeScript secara menyeluruh (tsc --noEmit) dan validasi struktur build untuk memastikan tidak ada error kompilasi, tipe any yang tidak aman, atau broken link sebelum proses rilis."`
- **Tujuan:**
  Menjamin integritas dan stabilitas kode sumber aplikasi dari potensi bug pada lingkungan produksi.
- **Hasil yang Dihasilkan AI:**
  Pemeriksaan TypeScript berhasil dengan status keluar kode 0 (`Exit code: 0, 0 errors`) tanpa ada kesalahan kompilasi.
- **Perubahan yang Dilakukan:**
  Penyelarasan tipe data antarmuka di `src/types/ecommerce.ts`.
- **Evaluasi / Validasi:**
  Aplikasi berhasil lulus uji kelayakan build produksi dengan performa optimal.