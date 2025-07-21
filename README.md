# Booking System --> Sistem Pemesanan Meja Billiard

Sistem ini adalah aplikasi berbasis web yang dibangun untuk membantu pengguna dalam melakukan pemesanan meja billiard secara online dan realtime.
Project ini merupakan bagian dari **penelitian skripsi** dengan fokus pada **penerapan mekanisme concurrency control** menggunakan **Firebase Transaction**, yang bertujuan untuk mencegah terjadinya **double booking** ketika dua atau lebih pengguna melakukan pemesanan pada waktu dan meja yang sama secara bersamaan.
Pada sistem sebelumnya, proses pemesanan dilakukan tanpa adanya pengendalian *concurrency* yang memadai, sehingga memungkinkan terjadinya konflik dan tabrakan data ketika beberapa pengguna melakukan booking secara bersamaan untuk waktu dan meja yang sama.
Melalui penelitian ini, telah diterapkan mekanisme **concurrency control** menggunakan **Firebase Realtime Database** dan fungsi `runTransaction()` dari Firebase untuk memastikan bahwa setiap proses booking dilakukan secara **atomik, konsisten, dan aman dari konflik**.
Dengan penerapan ini, sistem dapat mendeteksi dan mencegah pemesanan ganda secara otomatis, sehingga meningkatkan integritas data dan keandalan sistem dalam menangani transaksi secara simultan.

# Fitur Utama
- 🔐 Autentikasi User dan Admin (Firebase Auth)
- 📅 Pemesanan Antriaan Meja dengan Validasi Waktu
- ⏱️ Mekanisme Concurrency Control (Firebase Transaction)
- 📊 Dashboard Khusus User & Admin
- 💳 Simulasi Pembayaran dan Status "Paid"

# Teknologi
- **Frondent**: React + TypeScript
- **Backend**: Firebase Realtime Database, Firebase Auth

# Source Code Mekanisme Concurrency Control
await runTransaction(newBookingRef, (currentData) => {
            if (currentData === null) {
              return {
                uid: user.uid,
                name,
                date: today,
                time,
                table: selectedTable,
                duration,
                paymentMethod: method,
                paid: true,
                price: totalPrice,
                rescheduled: false,
              };
            }
            return;
          });
