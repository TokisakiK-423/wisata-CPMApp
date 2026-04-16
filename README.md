# 🌄 CPMApp Wisata  
### Tourism Management Platform (Mobile • API)

CPMApp Wisata adalah sistem manajemen wisata berbasis Mobile dan Backend API yang dirancang untuk mengelola data destinasi, booking tiket, serta review pengguna secara terintegrasi. Sistem ini menggunakan arsitektur REST API dengan autentikasi JWT untuk menjaga keamanan serta konsistensi data antar pengguna.

Platform ini berfokus pada **pengalaman pengguna (customer)** dan **kontrol penuh oleh admin**, dengan fitur validasi data, pembatasan akses, serta manajemen konten wisata secara dinamis.

---

## 🎯 Tujuan Sistem
- Mengelola data wisata secara terstruktur dan dinamis  
- Memfasilitasi booking tiket oleh customer  
- Memberikan sistem review transparan dan aman  
- Menyediakan kontrol admin terhadap data dan transaksi  

---

## 📡 API Testing (Apidog)

Dokumentasi dan pengujian API:
👉 https://share.apidog.com/bd0aa728-688f-4907-96a9-4974333717f6/admin-buat-data-wisata-33349705e0

Endpoint yang tersedia:
- Autentikasi (Login & Register)  
- Manajemen Wisata  
- Booking Tiket  
- Review  
- Galeri  

---

## ⚠️ Catatan Penggunaan
- Pastikan backend sudah berjalan  
- Base URL:
```
http://localhost:3000
```
- Gunakan JWT:
```
Authorization: Bearer <token>
```

---

## 🏗 Arsitektur Proyek
- `/api` → Backend (NestJS, Prisma, Database, JWT)  
- `/mobile` → Mobile App (React Native Expo)  

---

## 🔧 Teknologi

### Backend
- NestJS  
- Prisma ORM  
- MySQL / SQLite  
- JWT  
- Multer  

### Mobile
- React Native (Expo)  
- AsyncStorage  
- Image Picker  

---

## 📌 Instalasi

### 1. Backend
```
cd api
npm install
npm run start:dev
```

Server:
```
http://localhost:3000
```

---

### 2. Mobile
```
cd mobile
npm install
npx expo start
```

---

## ⚠️ Penting (Mobile URL)

❌ Jangan:
```
http://localhost:3000
```

✅ Gunakan:
```
http://10.0.2.2:3000
```
atau:
```
http://IP_KOMPUTER:3000
```

---

## 🔐 Auth (JWT)
```
Authorization: Bearer <token>
```

---

## 📡 Endpoint

### Auth
| Method | Endpoint |
|--------|----------|
| POST | /auth/login |
| POST | /auth/register |

### Wisata
| Method | Endpoint |
|--------|----------|
| GET | /wisata |
| POST | /wisata |
| PATCH | /wisata/:id |
| DELETE | /wisata/:id |

### Booking
| Method | Endpoint |
|--------|----------|
| POST | /booking |
| GET | /booking/my |
| GET | /booking |

### Review
| Method | Endpoint |
|--------|----------|
| POST | /review |
| GET | /review |
| DELETE | /review/:id |

---

## 🧠 Logic Sistem

### Review
- Bisa lihat semua review  
- ❌ Tidak bisa hapus milik orang lain  
- ✅ Hanya owner bisa hapus  

### Booking
- Customer lihat miliknya  
- Admin kontrol semua  
- Setelah disetujui:
  - ❌ Tidak bisa dihapus customer  

### Wisata
- Tidak bisa dihapus jika masih ada:
  - booking  
  - review  

---

## ⚙️ Checklist
- Node.js terinstall  
- Database siap  
- API jalan  
- Mobile pakai BASE_URL benar  
- Token tersimpan  

---

## 👤 Developer
Tokisaki  
https://github.com/TokisakiK-423/wisata-CPMApp.git
