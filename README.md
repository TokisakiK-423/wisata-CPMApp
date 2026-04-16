🌄 CPMApp Wisata
Tourism Management Platform (Mobile • API)

CPMApp Wisata adalah sistem manajemen wisata berbasis Mobile dan Backend API yang dirancang untuk mengelola data destinasi, booking tiket, serta review pengguna secara terintegrasi. Sistem ini menggunakan arsitektur REST API dengan autentikasi JWT untuk menjaga keamanan serta konsistensi data antar pengguna.

Platform ini berfokus pada pengalaman pengguna (customer) dan kontrol penuh oleh admin, dengan fitur validasi data, pembatasan akses, serta manajemen konten wisata secara dinamis.

🎯 Tujuan Sistem
Mengelola data wisata secara terstruktur dan dinamis
Memfasilitasi booking tiket oleh customer
Memberikan sistem review transparan dan aman
Menyediakan kontrol admin terhadap data dan transaksi
📡 API Testing (Apidog)

Dokumentasi dan pengujian API dapat diakses melalui Apidog pada link berikut:

https://share.apidog.com/bd0aa728-688f-4907-96a9-4974333717f6/admin-buat-data-wisata-33349705e0

Melalui halaman tersebut, seluruh endpoint utama dapat diuji secara langsung, meliputi:

Autentikasi (Login & Register)
Manajemen Wisata (Create, Update, Delete, Toggle Status)
Booking Tiket
Review Wisata
Galeri Gambar

Apidog digunakan untuk memvalidasi komunikasi antara aplikasi mobile dan backend API secara real-time.

⚠️ Catatan Penggunaan
Pastikan server backend sudah berjalan

Gunakan base URL:

http://localhost:3000

Untuk endpoint yang membutuhkan autentikasi:

Authorization: Bearer <token>
🏗 Arsitektur Proyek
/api → Backend (NestJS, Prisma, Database, JWT)
/mobile → Aplikasi Mobile (React Native Expo)
🔧 Teknologi yang Digunakan
Backend API
NestJS
Prisma ORM
MySQL / SQLite
JSON Web Token (JWT)
Multer (Upload Gambar)
Mobile App
React Native (Expo)
AsyncStorage
Expo Image Picker
Expo Linear Gradient
📌 Perangkat Wajib & Instalasi
✔ Node.js (WAJIB)

Minimal versi:

v18+

Download: https://nodejs.org/

✔ npm

Cek:

npm -v
✔ Database (WAJIB)

Gunakan salah satu:

MySQL
SQLite
✔ Git

https://git-scm.com/

✔ Expo CLI
npm install -g expo-cli
✔ Android Studio (Opsional)

Digunakan untuk emulator Android

✔ Expo Go (Opsional)

Untuk testing langsung di HP

🚀 Setup Backend API

Masuk ke folder API:

cd api
npm install

Jalankan server:

npm run start:dev

API berjalan di:

http://localhost:3000
📱 Setup Mobile App

Masuk ke folder mobile:

cd mobile
npm install
npx expo start
⚠️ Penting (WAJIB)

Ganti BASE_URL di mobile:

❌ Jangan:

http://localhost:3000

✅ Gunakan:

http://10.0.2.2:3000   (emulator)

atau

http://IP_KOMPUTER:3000   (HP asli)
🔐 Sistem Autentikasi

Menggunakan JWT (Token-Based Authentication)

Header:

Authorization: Bearer <token>
📡 REST API Overview
🔑 Auth
Method	Endpoint	Fungsi
POST	/auth/login	Login user
POST	/auth/register	Register customer
🏝 Wisata
Method	Endpoint	Fungsi
GET	/wisata	Ambil semua wisata
GET	/wisata/:id	Detail wisata
POST	/wisata	Tambah wisata
PATCH	/wisata/:id	Update wisata
PATCH	/wisata/:id/status	Aktif / Nonaktif
DELETE	/wisata/:id	Hapus wisata
🎫 Booking
Method	Endpoint	Fungsi
POST	/booking	Booking tiket
GET	/booking/my	Booking milik user
GET	/booking	Semua booking (admin)
PATCH	/booking/:id	Update status
DELETE	/booking/:id	Hapus booking
⭐ Review
Method	Endpoint	Fungsi
POST	/review	Buat review
GET	/review	Semua review
DELETE	/review/:id	Hapus review (owner only)
🖼 Galeri
Method	Endpoint	Fungsi
POST	/galeri	Tambah gambar
GET	/galeri/:wisataId	Ambil galeri
DELETE	/galeri/:id	Hapus gambar
🧠 Logic Penting (Core Rules)
🔒 Security Rules
JWT wajib untuk endpoint tertentu
Token disimpan di AsyncStorage
⭐ Review Rules
Customer dapat membuat review
Semua user dapat melihat review
❌ Tidak bisa menghapus review orang lain
✅ Hanya pembuat review yang bisa menghapus
🎫 Booking Rules
Customer hanya melihat booking miliknya
Admin dapat melihat semua booking
Admin dapat:
Menyetujui (Approve)
Menolak (Reject)
Menghapus (Delete)
Setelah booking disetujui:
❌ Customer tidak dapat menghapus booking
🏝 Wisata Rules
Admin tidak dapat menghapus wisata jika:
Masih memiliki data booking
Masih memiliki data review
⚙️ Checklist Sebelum Menjalankan
Node.js sudah terinstall
Database sudah siap
File .env sudah dibuat
Backend API berjalan di port 3000
Mobile menggunakan BASE_URL yang benar
Token JWT tersimpan setelah login
📄 Lisensi

MIT License

👤 Developer

Tokisaki
GitHub: https://github.com/TokisakiK-423/wisata-CPMApp.git
