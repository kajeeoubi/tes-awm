# System Flowchart & User Flow

## Mini E-Commerce & Realtime Dashboard

Dokumen ini menjelaskan alur kerja sistem (*System Architecture Flow*), alur pengguna customer (*Customer Flow*), serta alur administrator (*Admin Flow*).

---

## 1. Alur Transaksi & Sinkronisasi Realtime (System Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer (Guest)
    participant NextJS as 🌐 Next.js Frontend
    participant SupabaseDB as 🗄️ Supabase PostgreSQL
    participant RealtimeService as ⚡ Supabase Realtime
    actor Admin as 👨‍💼 Admin Dashboard

    Admin->>NextJS: Akses Dashboard (/admin)
    NextJS->>RealtimeService: Subscribe channel 'realtime-orders-channel'
    RealtimeService-->>NextJS: Status SUBSCRIBED (🟢 Live Active)

    Customer->>NextJS: Pilih produk & atur kuantitas (Cart)
    Customer->>NextJS: Input Nama & Nomor WhatsApp (Guest Checkout)
    Customer->>NextJS: Submit Order
    
    NextJS->>SupabaseDB: INSERT into `orders`
    NextJS->>SupabaseDB: INSERT into `order_items`
    NextJS->>SupabaseDB: UPDATE `products` (Kurangi Stok)
    SupabaseDB-->>NextJS: Order Created (Success)
    
    NextJS-->>Customer: Tampilkan Halaman Invoice (/order-success/[orderNumber])

    SupabaseDB->>RealtimeService: Trigger PostgreSQL INSERT Event
    RealtimeService->>Admin: Broadcast payload transaksi baru secara live
    Admin->>Admin: Update tabel transaksi, hitung ulang KPI & grafik otomatis
    Admin->>Admin: Putar audio notifikasi chime & tampilkan Toast pop-up
```

---

## 2. Customer User Flow (Guest Checkout)

```mermaid
flowchart TD
    Start([Buka Halaman Utama /]) --> Browse[Jelajahi Katalog Produk]
    Browse --> SearchFilter{Gunakan Search / Filter Kategori?}
    SearchFilter -- Ya --> FilterResults[Tampilkan Hasil Pencarian]
    SearchFilter -- Tidak --> SelectProduct[Pilih Produk]
    FilterResults --> SelectProduct

    SelectProduct --> AdjustQty[Tentukan Quantity / Jumlah]
    AdjustQty --> CheckStock{Stok Cukup?}
    CheckStock -- Tidak --> AlertStock[Tampilkan Peringatan Stok]
    AlertStock --> AdjustQty
    CheckStock -- Ya --> AddCart[Klik 'Tambah ke Keranjang']
    
    AddCart --> CartDrawer[Buka Slide-over Keranjang]
    CartDrawer --> AddMore{Beli Produk Lain?}
    AddMore -- Ya --> Browse
    AddMore -- Tidak --> FillForm[Isi Form Pembeli: Nama & No. WhatsApp]

    FillForm --> Validate{Data Valid?}
    Validate -- Tidak --> ShowError[Tampilkan Pesan Error]
    ShowError --> FillForm
    Validate -- Ya --> Submit[Klik 'Bayar Sekarang']
    
    Submit --> SaveDB[(Simpan ke Database Supabase)]
    SaveDB --> SuccessPage([Buka Halaman Konfirmasi Pesanan & Invoice])
```

---

## 3. Admin User Flow (Realtime Monitoring)

```mermaid
flowchart TD
    AdminStart([Buka Halaman /admin]) --> CheckAuth{Terautentikasi / Demo Session?}
    CheckAuth -- Belum --> LoginPage[Arahkan ke /admin/login]
    LoginPage --> AuthProcess[Input Email & Password Admin / Demo Login]
    AuthProcess --> CheckAuth
    CheckAuth -- Ya --> Dashboard[Tampilkan Dashboard Utama]

    Dashboard --> InitData[Fetch Data Penjualan & Riwayat Order]
    InitData --> ConnectRT[Koneksi ke Supabase Realtime Channel]
    ConnectRT --> ListenRT[Mendengarkan Event Transaksi Baru]

    ListenRT --> OnNewOrder{Ada Transaksi Baru Masuk?}
    OnNewOrder -- Ya --> LiveUpdate[Update KPI Cards, Grafik Recharts & Tabel Transaksi]
    LiveUpdate --> SoundToast[Mainkan Audio Chime & Tampilkan Pop-up Notifikasi]
    SoundToast --> ListenRT

    Dashboard --> ViewDetail[Klik Tombol 'Detail' Transaksi]
    ViewDetail --> ModalDetail[Buka Modal Rincian Pembelian Produk]
    ModalDetail --> UpdateStatus[Ubah Status: Pending / Processing / Completed / Cancelled]
    UpdateStatus --> SaveStatus[(Update Database Supabase)]
    SaveStatus --> Dashboard
```
