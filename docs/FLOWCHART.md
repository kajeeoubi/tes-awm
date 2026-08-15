# System Flowchart & User Flow

## Mini E-Commerce & Realtime Dashboard — Sparke

Dokumen ini menjelaskan arsitektur alur kerja sistem (*System Architecture Flow*), alur belanja pengguna customer (*Customer Checkout Flow*), serta alur pengoperasian dashboard administrator (*Admin Workflow*).

---

## 1. Alur Transaksi & Sinkronisasi Realtime (System Architecture Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer
    participant NextJS as 🌐 Next.js Frontend
    participant SupabaseDB as 🗄️ Supabase PostgreSQL
    participant RealtimeService as ⚡ Supabase Realtime Engine
    actor Admin as 👨‍💼 Admin Dashboard

    Admin->>NextJS: Login & Buka Dashboard (/admin)
    NextJS->>RealtimeService: Subscribe channel acak 'realtime_orders_[id]' & 'realtime_products_[id]'
    RealtimeService-->>NextJS: Channel SUBSCRIBED (🟢 Live Active)

    Customer->>NextJS: Pilih produk & atur kuantitas (Cart Context)
    Customer->>NextJS: Buka Slide-over Keranjang (Langkah 1: Review Item)
    Customer->>NextJS: Lanjut ke Pembayaran (Langkah 2: Isi Nama, WhatsApp, Alamat)
    Customer->>NextJS: Pilih/Ketik Voucher Diskon (Kalkulasi Diskon & Ongkir)
    Customer->>NextJS: Klik "Pesan Sekarang"
    
    NextJS->>SupabaseDB: INSERT ke tabel `orders` (Status: pending)
    NextJS->>SupabaseDB: INSERT ke tabel `order_items` (Snapshot harga historis)
    NextJS->>SupabaseDB: UPDATE kuantitas `products` (Pengurangan stok otomatis)
    SupabaseDB-->>NextJS: Transaksi Sukses Disimpan
    
    NextJS-->>Customer: Arahkan ke Halaman Invoice (/order-success/[orderNumber]) + Efek Confetti

    SupabaseDB->>RealtimeService: Trigger PostgreSQL INSERT Event (orders & order_items)
    RealtimeService->>Admin: Broadcast payload data transaksi baru secara live
    Admin->>Admin: Update otomatis Kartu Metrik KPI, Grafik Recharts, & Tabel Pesanan
    Admin->>Admin: Putar audio chime notifikasi Web Audio & tampilkan Toast Sonner
```

---

## 2. Customer User Flow (Storefront & Checkout)

```mermaid
flowchart TD
    Start([Buka Toko Online /]) --> Hero[Lihat Hero Banner & Produk Terbaru]
    Hero --> Scroll[Jelajahi Kategori / Penawaran Khusus / Katalog Lengkap]
    
    Scroll --> SearchFilter{Cari Nama / Filter Kategori?}
    SearchFilter -- Ya --> FilterCatalog[Tampilkan Produk Sesuai Kriteria]
    SearchFilter -- Tidak --> SelectItem[Pilih Produk]
    FilterCatalog --> SelectItem

    SelectItem --> AdjustQty[Tentukan Jumlah / Kuantitas]
    AdjustQty --> CheckStock{Stok Tersedia?}
    CheckStock -- Habis --> AlertOut[Tampilkan Peringatan Stok Habis]
    AlertOut --> SelectItem
    CheckStock -- Ada --> AddCart[Klik 'Tambah ke Keranjang']
    
    AddCart --> ToastAdd[Muncul Notifikasi Toast Top-Center]
    ToastAdd --> OpenDrawer[Buka Slide-Over Keranjang Belanja]
    
    OpenDrawer --> Step1[Langkah 1: Periksa Rincian Produk & Subtotal]
    Step1 --> ContinueCheck{Lanjut Pembayaran?}
    ContinueCheck -- Belanja Lagi --> Scroll
    ContinueCheck -- Lanjut --> Step2[Langkah 2: Formulir Checkout]
    
    Step2 --> InputData[Isi Nama Lengkap & No. WhatsApp]
    InputData --> InputAddress[Isi Alamat Lengkap Pengiriman]
    InputAddress --> CalcShipping[Ongkos Kirim Otomatis Dihitung Rp 20.000]
    
    CalcShipping --> ApplyVoucher{Pilih / Masukkan Kode Voucher?}
    ApplyVoucher -- Ya --> ValidateVoucher[Sistem Memvalidasi Syarat & Terapkan Diskon]
    ApplyVoucher -- Tidak --> ReviewTotal[Tinjau Rincian Total Akhir]
    ValidateVoucher --> ReviewTotal
    
    ReviewTotal --> ValidateForm{Formulir Lengkap & Valid?}
    ValidateForm -- Tidak --> ShowAlert[Tampilkan Notifikasi Error Validasi]
    ShowAlert --> Step2
    ValidateForm -- Ya --> SubmitOrder[Klik 'Pesan Sekarang']
    
    SubmitOrder --> SaveDatabase[(Simpan Transaksi & Kurangi Stok ke Supabase)]
    SaveDatabase --> OrderSuccess([Buka Halaman Invoice /order-success/ORD-XXXX + Animasi Confetti])
```

---

## 3. Administrator Workflow (Realtime Dashboard & Management)

```mermaid
flowchart TD
    AdminStart([Akses URL /admin]) --> CheckSession{Memiliki Sesi Aktif?}
    CheckSession -- Belum --> LoginView[Halaman Login /admin/login]
    LoginView --> InputAuth[Input Email & Password / Demo Quick Access]
    InputAuth --> VerifyAuth[(Verifikasi PBKDF2 & Set Signed Cookie Token)]
    VerifyAuth --> CheckSession
    
    CheckSession -- Ya --> DashboardHome[Buka Dashboard Ringkasan /admin]
    DashboardHome --> ConnectRealtime[Hubungkan Supabase Realtime Channels]
    
    ConnectRealtime --> ListenOrders[Mendengarkan Event Pesanan Baru]
    ListenOrders --> OnNewOrder{Ada Pesanan Baru Masuk?}
    OnNewOrder -- Ya --> UpdateUI[Update Realtime: KPI Revenue, Grafik Recharts, & Tabel]
    UpdateUI --> SoundToast[Putar Audio Notifikasi Chime & Toast Pop-up]
    SoundToast --> ListenOrders
    
    DashboardHome --> NavChoice{Pilih Menu Navigasi Admin}
    
    NavChoice -- Kelola Pesanan --> OrdersPage[/admin/orders]
    OrdersPage --> FilterOrders[Filter Status / Cari Nomor Pesanan]
    FilterOrders --> OrderDetail[Buka Rincian Pesanan & Item]
    OrderDetail --> ChangeStatus[Ubah Status: Pending / Diproses / Selesai / Dibatalkan]
    ChangeStatus --> SaveStatus[(Update Status Transaksi di Database)]
    SaveStatus --> OrdersPage

    NavChoice -- Katalog Produk --> ProductsPage[/admin/products]
    ProductsPage --> ProductActions{Aksi Produk}
    ProductActions -- Tambah Baru --> NewProduct[/admin/products/new]
    ProductActions -- Edit Produk --> EditProduct[/admin/products/id]
    NewProduct --> SaveProduct[(Simpan Master Produk dengan Dropdown Kategori)]
    EditProduct --> SaveProduct
    SaveProduct --> ProductsPage

    NavChoice -- Voucher & Promo --> VouchersPage[/admin/vouchers]
    VouchersPage --> VoucherActions{Aksi Voucher}
    VoucherActions -- Tambah Voucher --> NewVoucher[/admin/vouchers/new]
    VoucherActions -- Edit Voucher --> EditVoucher[/admin/vouchers/id]
    NewVoucher --> SaveVoucher[(Simpan Voucher dengan Dropdown Tipe & Status)]
    EditVoucher --> SaveVoucher
    SaveVoucher --> VouchersPage

    NavChoice -- Pengaturan Akun --> SettingsPage[/admin/settings]
    SettingsPage --> UpdateProfile[Ubah Nama, Email, Foto Avatar, atau Ganti Kata Sandi]
    UpdateProfile --> SaveProfile[(Simpan Profil & Perbarui Sesi Admin)]
    SaveProfile --> BroadcastProfile[Event Realtime Update Profil di Seluruh UI Sidebar]
```
