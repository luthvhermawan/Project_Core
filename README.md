# Booking System --> Sistem Pemesanan Meja Billiard

Sistem ini adalah aplikasi berbasis web yang dibangun untuk membantu pengguna dalam melakukan pemesanan meja billiard secara online dan realtime. Project ini merupakan bagian dari **penelitian skripsi** dengan fokus pada **penerapan mekanisme concurrency control** menggunakan **Firebase Transaction**, yang bertujuan untuk mencegah terjadinya **Race Condition** yang berupa **double booking** ketika dua atau lebih pengguna melakukan pemesanan pada waktu dan meja yang sama secara bersamaan. Pada sistem sebelumnya, proses pemesanan dilakukan tanpa adanya pengendalian *concurrency control* yang memadai, sehingga memungkinkan terjadinya konflik dan tabrakan data ketika beberapa pengguna melakukan booking secara bersamaan untuk waktu dan meja yang sama. Melalui penelitian ini, telah diterapkan mekanisme **concurrency control** menggunakan **Firebase Realtime Database** dengan menggunakan fitur `runTransaction()` dari Firebase untuk memastikan bahwa setiap proses booking dilakukan secara **atomik, konsisten, dan aman dari konflik**. Dengan penerapan ini, sistem dapat mencegah pemesanan ganda secara otomatis, sehingga meningkatkan integritas data dan keandalan sistem dalam menangani transaksi secara simultan.

# Fitur Utama
- 🔐 Autentikasi User & Admin (Firebase Auth)
Sistem menyediakan login dan registrasi terpisah untuk pengguna dan admin menggunakan Firebase Authentication, menjaga keamanan akses.
- 📅 Pemesanan Antrian Meja dengan Validasi Waktu
Pengguna dapat memilih nomor meja, tanggal, dan durasi booking yang divalidasi secara real-time agar tidak bentrok dengan jadwal lain.
- ⏱️ Mekanisme Concurrency Control (Firebase Transaction)
Untuk mencegah race condition dan double booking, sistem menggunakan runTransaction() dari Firebase Realtime Database sehingga hanya satu user yang berhasil booking jika terjadi pemesanan bersamaan.
- 📊 Dashboard Khusus untuk User & Admin
Dashboard user menampilkan informasi status meja, event, dan riwayat reservasi. Admin memiliki kontrol penuh untuk melihat semua data booking dan mengelola status meja.
- 💳 Simulasi Pembayaran & Status “Paid”
Sistem menyediakan fitur simulasi pembayaran. Setelah booking, pengguna dapat memilih metode pembayaran dan sistem akan mengubah status menjadi “Paid” setelah konfirmasi.

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
