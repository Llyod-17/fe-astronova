# Product Requirements Document (PRD)

## Sistem Manajemen Perjalanan Dinas (Travel Management System)

|             |                                |
| ----------- | ------------------------------ |
| **Dokumen** | PRD - Travel Management System |
| **Versi**   | 1.0                            |
| **Status**  | Draft                          |
| **Tanggal** | 11 September 2026              |

---

## 1. Latar Belakang

Perusahaan membutuhkan satu sistem terpusat untuk mengelola seluruh siklus perjalanan dinas karyawan — mulai dari pengajuan, approval berjenjang, booking tiket/akomodasi, pencairan uang muka, hingga reimbursement dan settlement pasca-perjalanan. Saat ini proses ini kemungkinan masih tersebar di berbagai channel (email, chat, spreadsheet manual) sehingga sulit ditelusuri, rawan human error, dan menyulitkan tim finance dalam rekonsiliasi.

Sistem ini akan menyatukan seluruh proses tersebut dalam satu platform berbasis web dengan 5 peran pengguna yang berbeda kebutuhan dan hak aksesnya.

## 2. Tujuan Produk

1. Menyediakan satu pintu (single source of truth) untuk seluruh proses perjalanan dinas.
2. Mempercepat siklus approval dengan workflow yang jelas dan dapat dikonfigurasi.
3. Memberikan visibilitas real-time atas status pengajuan, uang muka, dan settlement ke seluruh pihak terkait.
4. Mengurangi kesalahan pencatatan keuangan melalui integrasi Booking → Uang Muka → Reimbursement → Settlement → Pembayaran dalam satu alur data.
5. Memberikan kontrol kebijakan perjalanan (travel policy) yang konsisten dan dapat diaudit.

## 3. Ruang Lingkup

### 3.1 In-Scope

- Modul pengajuan perjalanan dinas oleh karyawan
- Modul approval berjenjang dengan fitur delegasi
- Modul booking & itinerary yang dikelola admin travel
- Modul keuangan: uang muka, reimbursement, settlement, pembayaran
- Modul manajemen vendor travel
- Modul administrasi sistem: master data, travel policy, workflow, user & role, integrasi, audit log
- Notifikasi lintas peran (in-app, dan opsional email/push)
- Laporan untuk approver, finance, dan super admin

### 3.2 Out-of-Scope (Fase 1)

- Pemesanan tiket langsung ke API maskapai/hotel (fase awal masih via admin travel manual/semi-manual dengan vendor)
- Aplikasi mobile native (fase awal web responsive)
- Integrasi payroll otomatis (pembayaran reimbursement lewat payroll masih manual/ekspor data)

## 4. Peran Pengguna (User Roles)

| Role               | Deskripsi Singkat                                                             |
| ------------------ | ----------------------------------------------------------------------------- |
| Karyawan           | Pemohon perjalanan dinas, pengaju uang muka & reimbursement                   |
| Atasan / Approver  | Menyetujui/menolak pengajuan, mendelegasikan approval, memantau tim           |
| Admin Travel       | Memproses booking, itinerary, dan koordinasi vendor                           |
| Finance / Keuangan | Mengelola pencairan dana, verifikasi settlement, pembayaran, laporan keuangan |
| Super Admin        | Mengelola konfigurasi sistem, kebijakan, workflow, user, vendor, dan audit    |

## 5. Alur Proses Utama (End-to-End Flow)

1. **Karyawan** mengajukan perjalanan dinas beserta estimasi uang muka.
2. **Atasan** melakukan approval — jika ditolak, pengajuan kembali ke karyawan untuk direvisi.
3. Jika disetujui, **Admin Travel** memproses booking tiket/akomodasi dan menyusun itinerary.
4. **Finance** mencairkan uang muka sesuai nominal yang disetujui.
5. **Karyawan** melakukan perjalanan, mengumpulkan bukti, lalu mengajukan settlement/reimbursement.
6. **Atasan** dan/atau **Finance** memverifikasi bukti dan menyetujui settlement.
7. **Finance** melakukan pembayaran final (pelunasan reimbursement atau penarikan sisa uang muka).
8. Notifikasi dikirim ke pihak terkait di setiap perubahan status.

_(Diagram alur sudah digambarkan pada percakapan sebelumnya — dapat disertakan sebagai lampiran visual PRD ini bila diperlukan.)_

## 6. Kebutuhan Fungsional per Modul

### 6.1 Karyawan

| Menu                 | Kebutuhan Fungsional                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dashboard            | Ringkasan status pengajuan aktif, uang muka berjalan, settlement pending, notifikasi terbaru                                                     |
| Pengajuan Perjalanan | Form pengajuan (tujuan, tanggal, keperluan, estimasi biaya, uang muka), pilih atasan approver, lampiran dokumen pendukung, submit untuk approval |
| Perjalanan Saya      | Riwayat & status seluruh perjalanan (draft, menunggu approval, disetujui, berlangsung, selesai, ditolak)                                         |
| Booking              | Melihat detail booking (tiket, hotel, itinerary) yang sudah diproses admin travel; request perubahan booking                                     |
| Uang Muka            | Melihat status pengajuan & pencairan uang muka, riwayat uang muka per perjalanan                                                                 |
| Reimbursement        | Ajukan klaim biaya di luar uang muka dengan upload bukti/kwitansi                                                                                |
| Settlement           | Ajukan settlement pasca-perjalanan: rekonsiliasi uang muka vs realisasi biaya, upload bukti pengeluaran                                          |
| Notifikasi           | Daftar notifikasi terkait status pengajuan, approval, pencairan dana, dan pengingat dokumen kurang                                               |

**Acceptance Criteria contoh (Pengajuan Perjalanan):**

- Karyawan tidak dapat submit pengajuan tanpa mengisi field wajib (tujuan, tanggal, estimasi biaya)
- Sistem otomatis mengarahkan pengajuan ke atasan langsung sesuai struktur organisasi, dengan opsi memilih approver lain jika didelegasikan
- Karyawan menerima notifikasi saat status pengajuan berubah (disetujui/ditolak/revisi)

### 6.2 Atasan / Approver

| Menu           | Kebutuhan Fungsional                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Dashboard      | Ringkasan jumlah pengajuan menunggu approval, tim yang sedang bepergian, tren pengajuan                     |
| Approval       | Daftar pengajuan masuk, detail lengkap sebelum approve/reject, kolom catatan revisi, approval massal (bulk) |
| Delegasi       | Mendelegasikan wewenang approval ke pihak lain untuk periode tertentu (misal saat cuti)                     |
| Perjalanan Tim | Visibilitas seluruh perjalanan anggota tim yang sedang berjalan/akan datang                                 |
| Laporan        | Laporan rekap pengajuan, tingkat approval, biaya perjalanan tim per periode                                 |
| Notifikasi     | Notifikasi pengajuan baru masuk, reminder pengajuan yang belum direspons                                    |

**Acceptance Criteria contoh (Approval):**

- Approval/reject wajib disertai catatan jika reject
- Sistem mencatat timestamp dan identitas approver untuk keperluan audit
- Jika delegasi aktif, pengajuan otomatis diteruskan ke delegate tanpa mengubah approver asli di riwayat

### 6.3 Admin Travel

| Menu               | Kebutuhan Fungsional                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Dashboard          | Ringkasan permintaan booking baru, booking dalam proses, itinerary yang perlu difinalisasi                   |
| Request Perjalanan | Daftar pengajuan yang sudah disetujui atasan dan siap diproses booking                                       |
| Booking            | Input/kelola detail booking tiket, hotel, transportasi lokal; status booking (pending, confirmed, cancelled) |
| Itinerary          | Susun & kelola jadwal detail perjalanan (drag-and-drop urutan aktivitas/destinasi), bagikan ke karyawan      |
| Vendor Travel      | Kelola daftar vendor (maskapai, agen tiket, hotel), assign booking ke vendor tertentu                        |
| Perjalanan         | Monitoring seluruh perjalanan yang sedang berjalan lintas karyawan                                           |
| Notifikasi         | Notifikasi request booking baru, perubahan jadwal, pembatalan                                                |

### 6.4 Finance / Keuangan

| Menu             | Kebutuhan Fungsional                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Dashboard        | Ringkasan total uang muka outstanding, reimbursement pending, settlement menunggu verifikasi |
| Uang Muka        | Verifikasi & proses pencairan uang muka sesuai pengajuan yang disetujui                      |
| Reimbursement    | Verifikasi klaim reimbursement, cek kesesuaian bukti dengan kebijakan (travel policy)        |
| Settlement       | Verifikasi rekonsiliasi uang muka vs realisasi, hitung selisih kurang/lebih bayar            |
| Pembayaran       | Proses pembayaran final ke karyawan (reimbursement/kekurangan) atau penagihan sisa uang muka |
| Laporan Keuangan | Laporan total biaya perjalanan dinas per periode, per divisi, per karyawan; ekspor Excel/PDF |
| Notifikasi       | Notifikasi settlement/reimbursement baru masuk, reminder verifikasi tertunda                 |

**Acceptance Criteria contoh (Settlement):**

- Sistem otomatis menghitung selisih antara uang muka yang dicairkan dan total realisasi biaya yang diajukan
- Finance dapat menyetujui, meminta revisi, atau menolak dengan catatan
- Status settlement final akan mengunci perjalanan tersebut dari perubahan lebih lanjut

### 6.5 Super Admin

| Menu                   | Kebutuhan Fungsional                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| Dashboard              | Ringkasan kesehatan sistem: jumlah user aktif, transaksi berjalan, anomali/alert                         |
| Master Data            | Kelola data referensi: divisi, jabatan, kota tujuan, kategori biaya, mata uang                           |
| Travel Policy          | Definisikan aturan kebijakan (limit biaya per grade jabatan, kelas penerbangan, batas uang muka)         |
| Workflow & Approval    | Konfigurasi alur approval berjenjang (jumlah level, kondisi approval berdasarkan nominal)                |
| User & Role Management | Kelola akun, role, dan hak akses pengguna di seluruh sistem                                              |
| Vendor Management      | Kelola data vendor travel secara global (kontrak, kontak, rating)                                        |
| Integrasi              | Konfigurasi integrasi dengan sistem lain (HRIS, payroll, akuntansi)                                      |
| Audit Log              | Rekam jejak seluruh aktivitas penting (approval, perubahan data, login) untuk keperluan audit/compliance |
| Laporan                | Laporan lintas modul untuk kebutuhan manajemen                                                           |
| Pengaturan Sistem      | Konfigurasi umum sistem (notifikasi, format nomor dokumen, branding)                                     |

## 7. Kebutuhan Non-Fungsional

| Kategori       | Kebutuhan                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| Keamanan       | Role-based access control (RBAC) ketat per modul & aksi; audit log untuk aktivitas sensitif                   |
| Performa       | Waktu muat halaman dashboard < 2 detik untuk data standar; sistem mampu menangani approval bulk tanpa timeout |
| Skalabilitas   | Arsitektur FE terpisah dari BE (headless), memungkinkan penambahan modul/role di masa depan                   |
| Ketersediaan   | Target uptime 99.5% untuk lingkungan produksi                                                                 |
| Auditability   | Setiap perubahan status (approval, pencairan dana, settlement) tercatat dengan timestamp dan pelaku           |
| Aksesibilitas  | Desain responsive, mendukung perangkat desktop dan tablet minimal                                             |
| Kepatuhan Data | Data finansial dan dokumen bukti disimpan dengan kontrol akses sesuai kebijakan internal                      |

## 8. Notifikasi (Ringkasan Trigger)

| Event                                    | Penerima                                        |
| ---------------------------------------- | ----------------------------------------------- |
| Pengajuan baru dibuat                    | Atasan (approver)                               |
| Approval disetujui/ditolak               | Karyawan                                        |
| Booking selesai diproses                 | Karyawan                                        |
| Uang muka dicairkan                      | Karyawan, Atasan                                |
| Settlement diajukan                      | Atasan, Finance                                 |
| Settlement disetujui/pembayaran final    | Karyawan                                        |
| Perubahan konfigurasi kebijakan/workflow | Super Admin (log), pihak terdampak jika relevan |

## 9. Entitas Data Utama (High-Level)

- **User** (role, divisi, jabatan, atasan langsung)
- **Pengajuan Perjalanan** (status, tujuan, tanggal, estimasi biaya, approver)
- **Approval** (level, approver, status, catatan, timestamp)
- **Booking** (vendor, tiket, akomodasi, status)
- **Itinerary** (urutan aktivitas, waktu, lokasi)
- **Uang Muka** (nominal diajukan, disetujui, dicairkan)
- **Reimbursement** (item biaya, bukti, status verifikasi)
- **Settlement** (uang muka vs realisasi, selisih, status final)
- **Vendor** (data kontak, kontrak, kategori layanan)
- **Travel Policy** (limit per grade, aturan kelas perjalanan)
- **Audit Log** (aktor, aksi, waktu, entitas terkait)

## 10. Matriks Fitur vs Role

| Fitur                      |   Karyawan   |   Atasan   | Admin Travel |  Finance   | Super Admin |
| -------------------------- | :----------: | :--------: | :----------: | :--------: | :---------: |
| Ajukan perjalanan          |      ✅      |     –      |      –       |     –      |      –      |
| Approval                   |      –       |     ✅     |      –       |     –      |      –      |
| Booking & itinerary        |    Lihat     |   Lihat    |      ✅      |     –      |      –      |
| Uang muka                  |    Ajukan    | Lihat tim  |      –       |   Proses   |      –      |
| Reimbursement              |    Ajukan    | Lihat tim  |      –       | Verifikasi |      –      |
| Settlement                 |    Ajukan    | Verifikasi |      –       | Verifikasi |      –      |
| Pembayaran                 | Lihat status |     –      |      –       |     ✅     |      –      |
| Vendor management          |      –       |     –      | Operasional  |     –      |   Master    |
| Travel policy              |      –       |     –      |      –       |     –      |     ✅      |
| Workflow & approval config |      –       |     –      |      –       |     –      |     ✅      |
| User & role management     |      –       |     –      |      –       |     –      |     ✅      |
| Audit log                  |      –       |     –      |      –       |     –      |     ✅      |

## 11. Asumsi & Batasan

- Struktur organisasi (karyawan–atasan) sudah tersedia sebagai data referensi (dari HRIS atau input manual Super Admin).
- Proses pembayaran akhir ke rekening karyawan mengikuti proses finance internal (belum ada integrasi payment gateway otomatis di fase 1).
- Booking tiket/hotel masih melibatkan koordinasi manual/semi-manual admin travel dengan vendor, belum API real-time ke maskapai.

## 12. Metrik Keberhasilan (Success Metrics)

- Rata-rata waktu approval pengajuan menurun dibanding proses manual sebelumnya
- Persentase settlement yang selesai tepat waktu (misal dalam 7 hari setelah perjalanan selesai)
- Berkurangnya selisih pencatatan keuangan (uang muka vs realisasi) yang tidak terverifikasi
- Adopsi pengguna aktif di seluruh 5 role dalam 3 bulan setelah rilis

## 13. Roadmap / Fase Berikutnya (Opsional)

- Integrasi API booking langsung ke vendor/maskapai
- Integrasi payroll otomatis untuk pembayaran reimbursement
- Aplikasi mobile untuk approval on-the-go
- Dashboard analytics prediktif untuk budgeting perjalanan dinas

---

_Catatan: Styling dokumen ini akan disesuaikan mengikuti `design.md`— dokumen ini berfokus pada kelengkapan konten dan struktur requirement._ *
