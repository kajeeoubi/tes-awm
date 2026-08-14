# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Mini E-Commerce & Realtime Dashboard

**Document Version:** 1.0  
**Project Type:** Technical Coding Test  
**Platform:** Web Application  
**Target Users:** Customer & Administrator

---

# 1. Project Overview

## 1.1 Background

Mini E-Commerce & Realtime Dashboard adalah aplikasi web yang dirancang untuk menyediakan proses pemesanan produk secara cepat tanpa mengharuskan customer melakukan registrasi atau login.

Aplikasi terdiri dari dua bagian utama:

1. **Customer / Guest Checkout**
2. **Admin Realtime Dashboard**

Customer dapat memilih satu atau beberapa produk, menentukan quantity, dan melakukan pemesanan. Pesanan yang berhasil dibuat akan tersimpan ke database dan secara otomatis ditampilkan pada dashboard admin secara realtime.

Admin dapat melakukan login ke halaman dashboard untuk memantau transaksi, melihat ringkasan penjualan, serta menganalisis data melalui tabel dan grafik.

---

# 2. Objectives

Tujuan utama aplikasi adalah:

- Menyediakan proses pemesanan produk yang sederhana dan cepat.
- Memungkinkan customer melakukan transaksi tanpa membuat akun.
- Mendukung pembelian beberapa jenis produk dalam satu transaksi.
- Menyediakan dashboard admin untuk memantau transaksi.
- Menampilkan data transaksi secara realtime.
- Menyediakan ringkasan statistik penjualan.
- Menampilkan visualisasi data penjualan melalui grafik.
- Memberikan pengalaman penggunaan yang responsif dan mudah digunakan.

Requirement utama tersebut mengikuti spesifikasi technical test yang diberikan.

---

# 3. Scope

## 3.1 In Scope

Fitur yang termasuk dalam project:

### Customer

- Melihat daftar produk.
- Melihat informasi produk.
- Memilih produk.
- Menentukan quantity.
- Menambahkan beberapa produk ke dalam satu pesanan.
- Melihat ringkasan pesanan.
- Mengisi informasi customer.
- Melakukan checkout tanpa login.
- Mendapatkan informasi bahwa pesanan berhasil dibuat.

### Admin

- Login admin.
- Dashboard admin yang terproteksi.
- Melihat transaksi.
- Melihat detail transaksi.
- Melihat summary statistik.
- Melihat grafik penjualan.
- Menerima update transaksi secara realtime.

### System

- Penyimpanan data produk.
- Penyimpanan data transaksi.
- Penyimpanan detail item transaksi.
- Perhitungan subtotal dan total transaksi.
- Realtime synchronization antara customer order dan admin dashboard.

---

# 4. User Roles

## 4.1 Customer

Customer adalah pengguna umum yang ingin melakukan pemesanan.

Customer:

- Tidak wajib membuat akun.
- Tidak perlu login.
- Dapat memilih beberapa produk.
- Dapat menentukan quantity.
- Dapat melakukan checkout.
- Dapat melihat status bahwa pesanan berhasil dibuat.

## 4.2 Administrator

Administrator merupakan pengguna yang memiliki akses ke dashboard.

Admin:

- Wajib melakukan login.
- Dapat melihat transaksi.
- Dapat melihat statistik penjualan.
- Dapat melihat grafik.
- Dapat memantau order baru secara realtime.

---

# 5. Functional Requirements

## FR-01 — Product Listing

System harus menampilkan daftar produk yang tersedia.

Informasi minimal:

- Product name
- Product image
- Price
- Stock
- Description

Customer dapat memilih produk yang ingin dibeli.

---

## FR-02 — Product Quantity

Customer dapat menentukan jumlah produk yang ingin dibeli.

System harus:

- Menyediakan kontrol quantity.
- Memastikan quantity minimal adalah 1.
- Memastikan quantity tidak melebihi stock.
- Menghitung subtotal berdasarkan quantity.

Formula:

**Subtotal = Product Price × Quantity**

---

## FR-03 — Multi Product Order

Customer dapat membeli lebih dari satu jenis produk dalam satu transaksi.

Contoh:

```text
Product A × 2
Product B × 1
Product C × 3
```

Seluruh produk tersebut disimpan sebagai satu order dengan beberapa order items.

Requirement multi-product merupakan bagian dari spesifikasi utama technical test.

---

## FR-04 — Guest Checkout

Customer dapat melakukan checkout tanpa melakukan login atau membuat akun.

Customer mengisi informasi yang diperlukan untuk pemesanan.

Data customer minimal:

- Name
- Phone number

Setelah customer melakukan submit, system membuat transaksi baru.

---

## FR-05 — Order Creation

Ketika customer melakukan checkout:

1. System melakukan validasi data.
2. System menghitung total transaksi.
3. System menyimpan order.
4. System menyimpan setiap produk ke order items.
5. System menghasilkan order number.
6. System menampilkan halaman/order confirmation.

---

## FR-06 — Order Number

Setiap transaksi memiliki nomor order yang unik.

Contoh:

```text
ORD-20260814-0001
```

Order number digunakan untuk mempermudah identifikasi transaksi pada dashboard admin.

---

## FR-07 — Admin Authentication

Halaman dashboard hanya dapat diakses oleh admin yang telah melakukan autentikasi.

Flow:

```text
Admin
 ↓
Login
 ↓
Authentication
 ↓
Admin Dashboard
```

Jika user belum terautentikasi dan mencoba mengakses dashboard, system harus mengarahkan user ke halaman login.

---

## FR-08 — Admin Dashboard

Dashboard menampilkan informasi utama mengenai kondisi penjualan.

Minimal summary:

- Total Orders
- Total Revenue
- Total Products Sold
- Today's Orders

Dashboard juga menampilkan:

- Transaction table
- Sales summary
- Sales chart

Requirement dashboard berupa tabel, summary, dan grafik mengikuti brief technical test.

---

## FR-09 — Transaction Table

Admin dapat melihat daftar transaksi dalam bentuk tabel.

Informasi minimal:

| Field | Description |
|---|---|
| Order Number | Nomor transaksi |
| Customer | Nama customer |
| Total Item | Jumlah item |
| Total Amount | Total transaksi |
| Status | Status order |
| Created At | Waktu transaksi |

Admin dapat membuka detail transaksi untuk melihat produk yang dibeli.

---

## FR-10 — Sales Chart

Dashboard menyediakan visualisasi data penjualan.

Chart minimal dapat menampilkan:

- Revenue berdasarkan tanggal.
- Jumlah order berdasarkan tanggal.

Contoh:

```text
Date        Orders        Revenue
14 Aug      12            Rp1.250.000
13 Aug      9             Rp950.000
12 Aug      15            Rp1.500.000
```

---

## FR-11 — Realtime Dashboard

Setiap transaksi baru yang dibuat customer harus dapat diterima oleh dashboard admin secara realtime.

Flow:

```text
Customer Checkout
       ↓
Create Order
       ↓
Database
       ↓
Realtime Event
       ↓
Admin Dashboard
       ↓
Update Transaction & Statistics
```

Admin tidak perlu melakukan refresh halaman secara manual untuk melihat transaksi baru.

Fitur realtime merupakan requirement utama pada technical test.

---

# 6. Additional Features

Untuk meningkatkan user experience, aplikasi dapat memiliki fitur tambahan berikut:

## 6.1 Search Product

Customer dapat mencari produk berdasarkan nama.

## 6.2 Category Filter

Customer dapat melakukan filter produk berdasarkan kategori.

## 6.3 Stock Indicator

System menampilkan kondisi stock:

```text
Available
Low Stock
Out of Stock
```

## 6.4 Order Status

Transaksi memiliki status:

```text
Pending
Processing
Completed
Cancelled
```

## 6.5 Notification

Admin mendapatkan notifikasi visual ketika terdapat order baru.

Contoh:

```text
New Order Received
ORD-20260814-0001
Total: Rp125.000
```

## 6.6 Responsive Design

Aplikasi harus dapat digunakan pada:

- Desktop
- Tablet
- Mobile

Fitur tambahan ini merupakan pengembangan yang diperbolehkan dalam brief untuk meningkatkan UX maupun kualitas sistem.

---

# 7. Non-Functional Requirements

## NFR-01 — Performance

Aplikasi harus memiliki waktu respons yang baik dan tidak melakukan proses yang tidak diperlukan.

## NFR-02 — Responsiveness

UI harus dapat menyesuaikan ukuran layar perangkat.

## NFR-03 — Security

Area admin harus dilindungi oleh autentikasi.

Customer tidak membutuhkan authentication untuk melakukan order.

## NFR-04 — Data Integrity

System harus memastikan:

- Total harga dihitung dengan benar.
- Quantity valid.
- Product yang dipilih tersedia.
- Order dan order items memiliki relasi yang benar.

## NFR-05 — Usability

Interface harus sederhana sehingga customer dapat melakukan order dengan langkah seminimal mungkin.

---

# 8. Proposed Technology Stack

Tech stack yang digunakan:

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend & Database

- Supabase
- PostgreSQL

### Authentication

- Supabase Authentication

### Realtime

- Supabase Realtime

### Deployment

- Vercel

### AI Coding Tools

- AI Coding Assistant seperti Cursor / Codex / GitHub Copilot.

Brief memberikan kebebasan dalam pemilihan teknologi, dengan bonus point untuk penggunaan **Next.js + Supabase dan deployment melalui Vercel**.

---

# 9. Database Overview

Database utama terdiri dari:

## Products

Menyimpan informasi produk.

```text
id
name
description
price
stock
image_url
created_at
updated_at
```

## Orders

Menyimpan informasi transaksi.

```text
id
order_number
customer_name
customer_phone
total_amount
status
created_at
updated_at
```

## Order Items

Menyimpan detail produk dalam sebuah transaksi.

```text
id
order_id
product_id
quantity
price
subtotal
```

Relationship:

```text
Products
    │
    │ 1 : N
    ▼
Order Items
    ▲
    │ N : 1
    │
  Orders
```

---

# 10. Customer User Flow

```text
Open Website
      ↓
View Products
      ↓
Select Product
      ↓
Set Quantity
      ↓
Add to Cart
      ↓
View Cart
      ↓
Checkout
      ↓
Fill Customer Information
      ↓
Review Order
      ↓
Submit Order
      ↓
Order Created
      ↓
Order Confirmation
```

---

# 11. Admin User Flow

```text
Admin Login
     ↓
Authentication
     ↓
Dashboard
     ↓
View Summary
     ↓
View Sales Chart
     ↓
View Transactions
     ↓
Receive New Order
     ↓
Realtime Dashboard Update
```

---

# 12. Success Criteria

Project dianggap berhasil apabila:

- Customer dapat melakukan order tanpa login.
- Customer dapat membeli lebih dari satu jenis produk dalam satu transaksi.
- Order tersimpan dengan benar ke database.
- Total transaksi dihitung dengan benar.
- Admin dapat login ke dashboard.
- Admin dapat melihat transaksi.
- Dashboard menampilkan summary statistik.
- Dashboard menampilkan grafik.
- Transaksi baru muncul secara realtime pada dashboard.
- Aplikasi dapat digunakan pada perangkat desktop maupun mobile.
- Aplikasi dapat diakses melalui deployment publik.

---

# 13. Documentation & Submission

Dokumentasi project akan terdiri dari:

1. Product Requirement Document (PRD)
2. Entity Relationship Diagram (ERD)
3. Flowchart / System Flow
4. AI Prompting Log
5. Screenshot aplikasi

Dokumentasi tersebut merupakan bagian wajib dari submission package berdasarkan instruksi technical test.

---

# 14. AI Prompting Documentation

Selama development, seluruh prompt yang digunakan dalam AI Coding Tools akan dicatat.

Dokumentasi minimal mencakup:

- Prompt
- Tujuan prompt
- Hasil yang dihasilkan AI
- Perubahan yang dilakukan
- Evaluasi/validasi hasil

Contoh:

```text
Prompt:
"Create a PostgreSQL database schema for a mini e-commerce
application supporting guest checkout and multi-product orders."

Purpose:
Membuat struktur database awal.

Result:
AI menghasilkan schema Products, Orders, dan Order Items.

Validation:
Schema diperiksa kembali dan disesuaikan dengan requirement project.
```

Penggunaan AI Coding Tools dan dokumentasi prompt merupakan requirement yang diwajibkan pada technical test.

---

# 15. Deployment

Aplikasi akan dideploy secara publik menggunakan:

**Vercel**

Database dan realtime service menggunakan:

**Supabase**

Target deployment:

```text
Customer
   ↓
Vercel
   ↓
Next.js Application
   ↓
Supabase
   ├── PostgreSQL
   ├── Authentication
   └── Realtime
```

---

# 16. Project Deliverables

Deliverables akhir:

- Source code aplikasi
- Public deployment
- PRD
- ERD
- Flowchart
- AI Prompting Log
- UI Screenshots
- Dokumentasi penggunaan aplikasi

---

# 17. Future Development

Fitur yang dapat dikembangkan pada versi berikutnya:

- Customer account
- Payment gateway
- Email/WhatsApp order notification
- Product management untuk admin
- Inventory management
- Advanced sales analytics
- Export report
- Multiple admin roles
- Order tracking

Fitur-fitur tersebut berada di luar scope utama coding test dan tidak menjadi prioritas pada versi pertama.

---

# 18. Conclusion

Mini E-Commerce & Realtime Dashboard berfokus pada proses pemesanan yang cepat bagi customer dan pemantauan transaksi secara realtime bagi admin.

Versi pertama memprioritaskan tiga kebutuhan utama:

1. **Simple Guest Checkout**
2. **Multi-Product Ordering**
3. **Realtime Admin Dashboard**

Dengan penggunaan Next.js, Supabase, dan Vercel, aplikasi diharapkan dapat memenuhi requirement technical test sekaligus menunjukkan kemampuan dalam pengembangan frontend, database, authentication, realtime system, dan deployment.