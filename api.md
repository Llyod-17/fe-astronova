# Astronova BE → FE API Guide

Panduan sambung FE (Svelte) ke BE Laravel ini. Semua endpoint JSON, envelope standar.
Sumber kebenaran: `routes/api.php` + `app/Http/Requests/*` + `app/Http/Resources/*` (bukan `api-req.md` lama yang field-nya basi).

## 0. Setup BE

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve # http://127.0.0.1:8000
```

Base URL FE: `http://127.0.0.1:8000/api`
Health: `GET /api/test`

```json
{ "success": true, "message": "Astronova API Ready", "data": null }
```

Header wajib: `Accept: application/json`. POST/PUT/PATCH JSON tambah `Content-Type: application/json`. Upload file pakai `FormData` (jangan set Content-Type manual).

## 1. Format Response Global

Sukses (`BaseApiController::sendSuccess`):

```json
{ "success": true, "message": "...", "data": {} }
```

Error (`sendError`):

```json
{ "success": false, "message": "Validasi gagal.", "errors": { "field": ["..."] } }
```

Kode: `200` GET/PUT/PATCH/DELETE, `201` POST/approve/reject, `404` tidak ketemu, `422` validasi/gagal bisnis, `400` upload gagal, `401` auth, `500` server.

Catatan field waktu: Resource aktual pakai `created_at` / `updated_at` ISO (`2026-09-01T08:00:00.000000Z`), bukan `dibuat_pada`. Angka uang di Resource dikirim sebagai number float (`3500000`, bukan `"3500000.00"`).

## 2. Kredensial Seeder (`php artisan migrate --seed`)

| Tabel | Data seeder |
|---|---|
| `users` (`DatabaseSeeder`, password semua `password123`) | `admin@astronova.co.id` (Admin Astronova), `manager@astronova.co.id` (Manager Astronova), `staff@astronova.co.id` (Staff Astronova) — ketiganya bisa login via `POST /api/login` |
| `departemen` (`DepartemenSeeder`) | `Teknologi Informasi` (id 1), `Keuangan` (id 2) |
| `karyawan` (`KaryawanSeeder`) | `KRY-001` Ahmad Fauzi `ahmad.fauzi@astronova.co.id` (TI, Software Engineer), `KRY-002` Budi Santoso `budi.santoso@astronova.co.id` (Keuangan, Financial Analyst) |
| `proyek` (`ProyekSeeder`) | `PROJ-CBS` / Core Banking System |
| `tujuan` (`TujuanSeeder`) | `Surabaya` / Surabaya / Indonesia |
| `kategori_pengeluaran` (`KategoriPengeluaranSeeder`) | `Transportasi` (id 1), `Hotel` (id 2), `Konsumsi` (id 3) |
| `pengajuan_perjalanan_tugas` | `TRV/202609/0001` draft (estimasi 3.5jt, UM 1jt), `TRV/202609/0002` menunggu_persetujuan (5jt), `TRV/202609/0099` disetujui (4jt, UM 3jt) |
| `pengajuan_penggantian` | `RMB/202609/0001` draft (total 4.2jt, UM 3jt, selisih 1.2jt kurang_bayar) |
| `pengeluaran_perjalanan` | Tiket Kereta Eksekutif Jakarta-Surabaya 650000, Corporate Card |
| `riwayat_persetujuan` | approve perjalanan menunggu → disetujui oleh Admin Astronova/Manager |

Urutan seed: Departemen → Karyawan → Proyek → Tujuan → Kategori → Pengeluaran → Pengajuan → Penggantian → Riwayat.

## 3. Auth — Login + Token (Sanctum)

Publik: `POST /api/login`, 6 resource master/transaksi, 2 PATCH status, `GET /test`.
Terkunci (`auth:sanctum`): `POST /logout`, `GET /me`, `persetujuan/*`, `bukti-struk`, `dokumen-pendukung`, `log-audit`.

CORS sudah dibuka untuk `http://localhost:5173` + `http://127.0.0.1:5173` (`config/cors.php` + `HandleCors` di `bootstrap/app.php`). Upload `url` (`/storage/...`) butuh `php artisan storage:link`.

### `POST /api/login` → 201 (publik)

Request (`email*`, `password* min:8`):

```json
{ "email": "staff@astronova.co.id", "password": "password123" }
```

Response:

```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": { "id": 3, "name": "Staff Astronova", "email": "staff@astronova.co.id" },
    "token": "1|AbCdEf..."
  }
}
```

Gagal (`401`): `{ "success": false, "message": "Email atau password salah.", "errors": {} }`.
Validasi (`422`): `{ "success": false, "message": "Validasi gagal. Periksa kembali data yang dikirim.", "errors": { "email": ["..."] } }`.

### `GET /api/me` → 200 (auth)

Header: `Authorization: Bearer <token>`.

```json
{
  "success": true,
  "message": "Data pengguna berhasil diambil.",
  "data": { "id": 3, "name": "Staff Astronova", "email": "staff@astronova.co.id" }
}
```

### `POST /api/logout` → 200 (auth)

Mencabut token saat ini. Response: `{ "success": true, "message": "Logout berhasil.", "data": null }`.

### Test per role di FE

Login sebagai `staff@` → POST perjalanan → logout. Login sebagai `manager@` → approve (`peran_approver: "Manager"`) → cek history + log-audit. `peran` karyawan cuma string bebas di master (bukan sistem role), jadi beda peran = beda akun `users` + isi `nama_approver/peran_approver` manual.

```js
import { apiFetch, setToken } from '$lib/api';
const r = await apiFetch('/login', { method: 'POST', body: { email: 'staff@astronova.co.id', password: 'password123' } });
setToken(r.data.token); // simpan di localStorage
await apiFetch('/me', { auth: true });
await apiFetch('/logout', { method: 'POST', auth: true });
setToken(null);
```

## 4. Helper Svelte (taruh sekali, pakai semua)

```js
// src/lib/api.js
export const BASE = 'http://127.0.0.1:8000/api';
export let token = null; // isi dari tinker di atas
export const setToken = (t) => (token = t);

export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const isForm = body instanceof FormData;
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined
  });
  const json = await res.json().catch(() => ({}));
  if (!json.success) throw { status: res.status, ...json };
  return json; // {success, message, data}
}
```

Pakai di component:

```svelte
<script>
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api';
  let list = [];
  let err = '';
  onMount(async () => {
    try {
      const r = await apiFetch('/departemen');
      list = r.data;
    } catch (e) { err = e.message; }
  });
</script>
```

---

## 5. Departemen (publik)

Resource (`DepartemenResource`): `{id_departemen, nama_departemen, karyawan? (hanya saat detail/with), created_at, updated_at}`.

### `GET /api/departemen` → 200

```json
{
  "success": true,
  "message": "Daftar departemen berhasil diambil.",
  "data": [
    { "id_departemen": 1, "nama_departemen": "Teknologi Informasi", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" },
    { "id_departemen": 2, "nama_departemen": "Keuangan", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" }
  ]
}
```

### `POST /api/departemen` → 201

Request (`StoreDepartemenRequest`: `nama_departemen* string max:100`):

```json
{ "nama_departemen": "Operasional & Logistik" }
```

Response:

```json
{
  "success": true,
  "message": "Departemen berhasil ditambahkan.",
  "data": { "id_departemen": 3, "nama_departemen": "Operasional & Logistik", "created_at": "2026-09-01T08:15:00.000000Z", "updated_at": "2026-09-01T08:15:00.000000Z" }
}
```

422 bila kosong:

```json
{ "success": false, "message": "Validasi gagal.", "errors": { "nama_departemen": ["The nama departemen field is required."] } }
```

### `GET /api/departemen/{id}` → 200

```json
{
  "success": true,
  "message": "Detail departemen berhasil diambil.",
  "data": {
    "id_departemen": 1,
    "nama_departemen": "Teknologi Informasi",
    "karyawan": [
      { "id_karyawan": 1, "nik": "KRY-001", "nama_lengkap": "Ahmad Fauzi", "email": "ahmad.fauzi@astronova.co.id", "telepon": "081234567890", "id_departemen": 1, "peran": "Software Engineer", "created_at": "2026-09-01T08:05:00.000000Z", "updated_at": "2026-09-01T08:05:00.000000Z" }
    ],
    "created_at": "2026-09-01T08:00:00.000000Z",
    "updated_at": "2026-09-01T08:00:00.000000Z"
  }
}
```

404:

```json
{ "success": false, "message": "Departemen tidak ditemukan.", "errors": {} }
```

### `PUT /api/departemen/{id}` → 200

Request: sama kayak POST (`nama_departemen*`).

```json
{ "nama_departemen": "TI Baru" }
```

Response:

```json
{
  "success": true,
  "message": "Departemen berhasil diperbarui.",
  "data": { "id_departemen": 1, "nama_departemen": "TI Baru", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T09:00:00.000000Z" }
}
```

### `DELETE /api/departemen/{id}` → 200

```json
{ "success": true, "message": "Departemen berhasil dihapus.", "data": null }
```

Svelte:

```js
await apiFetch('/departemen');
await apiFetch('/departemen', { method: 'POST', body: { nama_departemen: 'QA' } });
await apiFetch('/departemen/1');
await apiFetch('/departemen/1', { method: 'PUT', body: { nama_departemen: 'TI Baru' } });
await apiFetch('/departemen/9', { method: 'DELETE' });
```

---

## 6. Karyawan (publik)

Resource (`KaryawanResource`): `{id_karyawan, nik, nama_lengkap, email, telepon, id_departemen, departemen? (saat with), peran, created_at, updated_at}`.

### `GET /api/karyawan` → 200

```json
{
  "success": true,
  "message": "Daftar karyawan berhasil diambil.",
  "data": [
    { "id_karyawan": 1, "nik": "KRY-001", "nama_lengkap": "Ahmad Fauzi", "email": "ahmad.fauzi@astronova.co.id", "telepon": "081234567890", "id_departemen": 1, "peran": "Software Engineer", "created_at": "2026-09-01T08:05:00.000000Z", "updated_at": "2026-09-01T08:05:00.000000Z" },
    { "id_karyawan": 2, "nik": "KRY-002", "nama_lengkap": "Budi Santoso", "email": "budi.santoso@astronova.co.id", "telepon": "081298765432", "id_departemen": 2, "peran": "Financial Analyst", "created_at": "2026-09-01T08:05:00.000000Z", "updated_at": "2026-09-01T08:05:00.000000Z" }
  ]
}
```

### `POST /api/karyawan` → 201

Request (`StoreKaryawanRequest`): `nik* unique max:50, nama_lengkap* max:150, email* unique email max:150, telepon? max:30, id_departemen* exists, peran* max:100`.

```json
{
  "nik": "KRY-101",
  "nama_lengkap": "Siti Rahmawati",
  "email": "siti.rahma@astronova.co.id",
  "telepon": "081377889900",
  "id_departemen": 1,
  "peran": "Operations Lead"
}
```

Response:

```json
{
  "success": true,
  "message": "Karyawan berhasil ditambahkan.",
  "data": {
    "id_karyawan": 3,
    "nik": "KRY-101",
    "nama_lengkap": "Siti Rahmawati",
    "email": "siti.rahma@astronova.co.id",
    "telepon": "081377889900",
    "id_departemen": 1,
    "departemen": { "id_departemen": 1, "nama_departemen": "Teknologi Informasi", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" },
    "peran": "Operations Lead",
    "created_at": "2026-09-01T08:10:00.000000Z",
    "updated_at": "2026-09-01T08:10:00.000000Z"
  }
}
```

### `GET /api/karyawan/{id}` → 200

Sama kayak POST response (single object + `departemen`).

### `PUT /api/karyawan/{id}` → 200

Request (`UpdateKaryawanRequest`): semua field optional tapi bila dikirim ikut aturan unique kecuali diri sendiri. Contoh ganti peran:

```json
{ "peran": "Senior Engineer", "telepon": "081111222333" }
```

Response: object karyawan terbaru + `message: "Karyawan berhasil diperbarui."`.

### `DELETE /api/karyawan/{id}` → 200

```json
{ "success": true, "message": "Karyawan berhasil dihapus.", "data": null }
```

```js
await apiFetch('/karyawan');
await apiFetch('/karyawan', { method: 'POST', body: { nik: 'KRY-101', nama_lengkap: 'Siti', email: 'siti@x.id', id_departemen: 1, peran: 'Staff' } });
await apiFetch('/karyawan/1');
await apiFetch('/karyawan/1', { method: 'PUT', body: { peran: 'Senior Engineer' } });
await apiFetch('/karyawan/9', { method: 'DELETE' });
```

---

## 7. Proyek (publik)

Resource: `{id_proyek, nama_proyek, kode_proyek, created_at, updated_at}`.

### `GET /api/proyek` → 200

```json
{
  "success": true,
  "message": "Daftar proyek berhasil diambil.",
  "data": [
    { "id_proyek": 1, "nama_proyek": "Core Banking System", "kode_proyek": "PROJ-CBS", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" }
  ]
}
```

### `POST /api/proyek` → 201

Request (`nama_proyek* max:150, kode_proyek* unique max:50`):

```json
{ "nama_proyek": "ERP Upgrade", "kode_proyek": "PROJ-ERP-02" }
```

Response:

```json
{
  "success": true,
  "message": "Proyek berhasil ditambahkan.",
  "data": { "id_proyek": 2, "nama_proyek": "ERP Upgrade", "kode_proyek": "PROJ-ERP-02", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" }
}
```

### `GET /api/proyek/{id}` → 200 (single object sama)

### `PUT /api/proyek/{id}` → 200

```json
{ "nama_proyek": "ERP Upgrade Rev2", "kode_proyek": "PROJ-ERP-02" }
```

### `DELETE /api/proyek/{id}` → 200

```json
{ "success": true, "message": "Proyek berhasil dihapus.", "data": null }
```

---

## 8. Tujuan (publik)

Resource: `{id_tujuan, nama_tujuan, kota, negara, created_at, updated_at}`.

### `GET /api/tujuan` → 200

```json
{
  "success": true,
  "message": "Daftar tujuan berhasil diambil.",
  "data": [
    { "id_tujuan": 1, "nama_tujuan": "Surabaya", "kota": "Surabaya", "negara": "Indonesia", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" }
  ]
}
```

### `POST /api/tujuan` → 201

Request (`nama_tujuan*, kota*, negara*`):

```json
{ "nama_tujuan": "Kantor Cabang Bandung", "kota": "Bandung", "negara": "Indonesia" }
```

Response `201`: object tujuan + `message: "Tujuan berhasil ditambahkan."`.

### `GET /api/tujuan/{id}` → 200, `PUT` → 200, `DELETE` → 200 (pola sama master lain).

---

## 9. Kategori Pengeluaran (publik)

Resource: `{id_kategori, nama_kategori, deskripsi, pengeluaran_perjalanan? (saat with), created_at, updated_at}`.

### `GET /api/kategori-pengeluaran` → 200

```json
{
  "success": true,
  "message": "Daftar kategori pengeluaran berhasil diambil.",
  "data": [
    { "id_kategori": 1, "nama_kategori": "Transportasi", "deskripsi": "Biaya tiket pesawat, kereta, taksi, dan transportasi lokal.", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" },
    { "id_kategori": 2, "nama_kategori": "Hotel", "deskripsi": "Biaya akomodasi dan penginapan hotel.", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" },
    { "id_kategori": 3, "nama_kategori": "Konsumsi", "deskripsi": "Uang makan harian dan biaya konsumsi selama perjalanan dinas.", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" }
  ]
}
```

### `POST /api/kategori-pengeluaran` → 201

Request (`nama_kategori* max:100, deskripsi?`):

```json
{ "nama_kategori": "Internet & Komunikasi", "deskripsi": "Roaming dinas" }
```

Response:

```json
{
  "success": true,
  "message": "Kategori pengeluaran berhasil ditambahkan.",
  "data": { "id_kategori": 4, "nama_kategori": "Internet & Komunikasi", "deskripsi": "Roaming dinas", "created_at": "2026-09-01T08:00:00.000000Z", "updated_at": "2026-09-01T08:00:00.000000Z" }
}
```

### `GET /{id}` → 200, `PUT` → 200, `DELETE` → 200.

---

## 10. Pengeluaran Perjalanan (publik)

Resource (`PengeluaranPerjalananResource`): `{id_pengeluaran, id_pengajuan, id_kategori, kategori? (with), tanggal_pengeluaran: Y-m-d, deskripsi, jumlah: float, metode_pembayaran, sudah_diganti: bool, created_at, updated_at}`.

### `GET /api/pengeluaran-perjalanan` → 200

```json
{
  "success": true,
  "message": "Daftar pengeluaran perjalanan berhasil diambil.",
  "data": [
    { "id_pengeluaran": 1, "id_pengajuan": 1, "id_kategori": 1, "tanggal_pengeluaran": "2026-09-08", "deskripsi": "Tiket Kereta Eksekutif Jakarta - Surabaya", "jumlah": 650000, "metode_pembayaran": "Corporate Card", "sudah_diganti": false, "created_at": "2026-09-01T08:45:00.000000Z", "updated_at": "2026-09-01T08:45:00.000000Z" }
  ]
}
```

### `POST /api/pengeluaran-perjalanan` → 201

Request (`id_pengajuan? int, id_kategori* exists, tanggal_pengeluaran* date, deskripsi?, jumlah* min:0, metode_pembayaran* max:50, sudah_diganti? boolean`):

```json
{
  "id_pengajuan": 1,
  "id_kategori": 1,
  "tanggal_pengeluaran": "2026-09-08",
  "deskripsi": "Taksi bandara",
  "jumlah": 175000,
  "metode_pembayaran": "Corporate Card",
  "sudah_diganti": false
}
```

Response:

```json
{
  "success": true,
  "message": "Pengeluaran perjalanan berhasil dicatat.",
  "data": { "id_pengeluaran": 2, "id_pengajuan": 1, "id_kategori": 1, "tanggal_pengeluaran": "2026-09-08", "deskripsi": "Taksi bandara", "jumlah": 175000, "metode_pembayaran": "Corporate Card", "sudah_diganti": false, "created_at": "2026-09-01T08:45:00.000000Z", "updated_at": "2026-09-01T08:45:00.000000Z" }
}
```

### `GET /api/pengeluaran-perjalanan/{id}` → 200 (single + `kategori` saat with)

### `PUT /api/pengeluaran-perjalanan/{id}` → 200

```json
{ "jumlah": 200000, "metode_pembayaran": "Cash", "sudah_diganti": true }
```

### `DELETE /api/pengeluaran-perjalanan/{id}` → 200

```json
{ "success": true, "message": "Pengeluaran perjalanan berhasil dihapus.", "data": null }
```

```js
await apiFetch('/pengeluaran-perjalanan');
await apiFetch('/pengeluaran-perjalanan', { method: 'POST', body: { id_kategori: 1, tanggal_pengeluaran: '2026-09-08', jumlah: 175000, metode_pembayaran: 'Cash' } });
```

---

## 11. Pengajuan Perjalanan (publik)

Resource (`PengajuanPerjalananResource`): `{id_pengajuan, nomor_pengajuan (TRV/...), id_karyawan, karyawan?, id_proyek, proyek?, id_tujuan, tujuan?, tanggal_mulai, tanggal_selesai, maksud_tujuan, estimasi_biaya: float (sum details), uang_muka: float, status, status_label, catatan, details[] {id_detail, id_kategori, kategori?, estimasi_biaya, keterangan}, created_at, updated_at}`.

Enum `status`: `draft, menunggu_persetujuan, disetujui, ditolak`. Transisi: `draft→menunggu_persetujuan`, `menunggu_persetujuan→disetujui|ditolak`.

### `GET /api/pengajuan-perjalanan` → 200

```json
{
  "success": true,
  "message": "Daftar pengajuan perjalanan berhasil diambil.",
  "data": [
    {
      "id_pengajuan": 1,
      "nomor_pengajuan": "TRV/202609/0001",
      "id_karyawan": 1,
      "id_proyek": 1,
      "id_tujuan": 1,
      "tanggal_mulai": "2026-09-25",
      "tanggal_selesai": "2026-09-28",
      "maksud_tujuan": "Kunjungan kerja Surabaya",
      "estimasi_biaya": 3500000,
      "uang_muka": 1000000,
      "status": "draft",
      "status_label": "Draft",
      "catatan": "Membutuhkan uang muka operasional awal",
      "created_at": "2026-09-01T08:30:00.000000Z",
      "updated_at": "2026-09-01T08:30:00.000000Z"
    }
  ]
}
```

### `POST /api/pengajuan-perjalanan` → 201

Request:

```json
{
  "id_karyawan": 1,
  "id_proyek": 1,
  "id_tujuan": 1,
  "tanggal_mulai": "2026-09-25",
  "tanggal_selesai": "2026-09-28",
  "maksud_tujuan": "Koordinasi teknis Surabaya",
  "uang_muka": 1000000,
  "catatan": "Butuh UM awal",
  "details": [
    { "id_kategori": 1, "estimasi_biaya": 2000000, "keterangan": "Tiket PP" },
    { "id_kategori": 2, "estimasi_biaya": 1500000, "keterangan": "Hotel 3 malam" }
  ]
}
```

Wajib: `id_karyawan, id_tujuan, tanggal_mulai, tanggal_selesai (>= mulai), maksud_tujuan`. `nomor_pengajuan` + `estimasi_biaya` digenerate server, status awal `draft`.

Response:

```json
{
  "success": true,
  "message": "Pengajuan perjalanan berhasil dibuat.",
  "data": {
    "id_pengajuan": 5,
    "nomor_pengajuan": "TRV/202609/0005",
    "id_karyawan": 1,
    "id_proyek": 1,
    "id_tujuan": 1,
    "tanggal_mulai": "2026-09-25",
    "tanggal_selesai": "2026-09-28",
    "maksud_tujuan": "Koordinasi teknis Surabaya",
    "estimasi_biaya": 3500000,
    "uang_muka": 1000000,
    "status": "draft",
    "status_label": "Draft",
    "catatan": "Butuh UM awal",
    "details": [
      { "id_detail": 10, "id_pengajuan": 5, "id_kategori": 1, "estimasi_biaya": 2000000, "keterangan": "Tiket PP", "created_at": "2026-09-01T08:30:00.000000Z", "updated_at": "2026-09-01T08:30:00.000000Z" }
    ],
    "created_at": "2026-09-01T08:30:00.000000Z",
    "updated_at": "2026-09-01T08:30:00.000000Z"
  }
}
```

### `GET /api/pengajuan-perjalanan/{id}` → 200

Sama kayak POST tapi full relasi `karyawan, proyek, tujuan, details[].kategori`.

### `PUT /api/pengajuan-perjalanan/{id}` → 200

Body sama kayak POST (partial boleh). Response object terbaru.

### `PATCH /api/pengajuan-perjalanan/{id}/status` → 200

Request (`status* enum, catatan?`):

```json
{ "status": "menunggu_persetujuan", "catatan": "Ajukan ke manajer" }
```

Response: pengajuan dengan status baru. 422 kalau transisi ilegal (`disetujui` tidak bisa balik ke `draft`).

### `DELETE /api/pengajuan-perjalanan/{id}` → 200

```json
{ "success": true, "message": "Pengajuan perjalanan berhasil dihapus.", "data": null }
```

```js
await apiFetch('/pengajuan-perjalanan');
await apiFetch('/pengajuan-perjalanan', { method: 'POST', body: { id_karyawan: 1, id_tujuan: 1, tanggal_mulai: '2026-09-25', tanggal_selesai: '2026-09-28', maksud_tujuan: 'Dinas' } });
await apiFetch('/pengajuan-perjalanan/1');
await apiFetch('/pengajuan-perjalanan/1/status', { method: 'PATCH', body: { status: 'menunggu_persetujuan' } });
```

---

## 12. Pengajuan Penggantian / Reimbursement (publik)

Resource: `{id_penggantian, nomor_penggantian (RMB/...), id_pengajuan, pengajuan_perjalanan?, tanggal_pengajuan: Y-m-d, total_pengeluaran: float, uang_muka: float, selisih: float, kondisi_penggantian: kurang_bayar|lebih_bayar|sesuai, kondisi_penggantian_label, status, status_label, catatan, details[] {id_detail, id_kategori, kategori?, tanggal_pengeluaran, deskripsi, jumlah, bukti_file}, created_at, updated_at}`.

### `GET /api/pengajuan-penggantian` → 200

```json
{
  "success": true,
  "message": "Daftar pengajuan penggantian berhasil diambil.",
  "data": [
    {
      "id_penggantian": 1,
      "nomor_penggantian": "RMB/202609/0001",
      "id_pengajuan": 3,
      "tanggal_pengajuan": "2026-09-15",
      "total_pengeluaran": 4200000,
      "uang_muka": 3000000,
      "selisih": 1200000,
      "kondisi_penggantian": "kurang_bayar",
      "kondisi_penggantian_label": "Kurang Bayar (Perusahaan Bayar ke Karyawan)",
      "status": "draft",
      "status_label": "Draft",
      "catatan": "Klaim hotel",
      "created_at": "2026-09-01T09:00:00.000000Z",
      "updated_at": "2026-09-01T09:00:00.000000Z"
    }
  ]
}
```

### `POST /api/pengajuan-penggantian` → 201

Request (`id_pengajuan* exists unique, tanggal_pengajuan* date, catatan?, details* min:1`):

```json
{
  "id_pengajuan": 3,
  "tanggal_pengajuan": "2026-09-15",
  "catatan": "Klaim hotel",
  "details": [
    { "id_kategori": 1, "tanggal_pengeluaran": "2026-09-10", "deskripsi": "Tiket+Taxi", "jumlah": 2500000, "bukti_file": "struk_tiket_01.pdf" },
    { "id_kategori": 2, "tanggal_pengeluaran": "2026-09-12", "deskripsi": "Hotel", "jumlah": 1700000 }
  ]
}
```

Response: object seperti GET + `details[]` + `message: "Pengajuan penggantian berhasil dibuat."`. `total/UM/selisih/kondisi/nomor` dihitung server.

### `GET /api/pengajuan-penggantian/{id}` → 200 (full + `pengajuan_perjalanan` + `details[].kategori`)

### `PUT /api/pengajuan-penggantian/{id}` → 200 (edit draft; body sama kayak POST)

### `PATCH /api/pengajuan-penggantian/{id}/status` → 200

```json
{ "status": "menunggu_persetujuan", "catatan": "Ajukan" }
```

### `DELETE /api/pengajuan-penggantian/{id}` → 200

```js
await apiFetch('/pengajuan-penggantian');
await apiFetch('/pengajuan-penggantian', { method: 'POST', body: { id_pengajuan: 3, tanggal_pengajuan: '2026-09-15', details: [{ id_kategori: 1, tanggal_pengeluaran: '2026-09-10', jumlah: 2500000 }] } });
```

---

## 13. Persetujuan (auth `Bearer`)

Resource (`RiwayatPersetujuanResource`): `{id_persetujuan, approvable_type: pengajuan_perjalanan|pengajuan_penggantian, approvable_id, id_user, nama_approver, peran_approver, status: disetujui|ditolak, status_label, catatan, approved_at, created_at, updated_at}`. Efek samping: status dokumen ikut berubah.

### `POST /api/persetujuan/approve` → 201 (auth)

Request (`approvable_type*, approvable_id*, nama_approver?, peran_approver?, catatan?`):

```json
{
  "approvable_type": "pengajuan_perjalanan",
  "approvable_id": 2,
  "nama_approver": "Admin Astronova",
  "peran_approver": "Manager",
  "catatan": "OK, lanjut"
}
```

Response:

```json
{
  "success": true,
  "message": "Dokumen berhasil disetujui.",
  "data": {
    "id_persetujuan": 5,
    "approvable_type": "pengajuan_perjalanan",
    "approvable_id": 2,
    "id_user": 1,
    "nama_approver": "Admin Astronova",
    "peran_approver": "Manager",
    "status": "disetujui",
    "status_label": "Disetujui",
    "catatan": "OK, lanjut",
    "approved_at": "2026-09-01T09:30:00.000000Z",
    "created_at": "2026-09-01T09:30:00.000000Z",
    "updated_at": "2026-09-01T09:30:00.000000Z"
  }
}
```

### `POST /api/persetujuan/reject` → 201 (auth)

Sama, tapi `catatan* wajib`:

```json
{
  "approvable_type": "pengajuan_penggantian",
  "approvable_id": 1,
  "nama_approver": "Admin Astronova",
  "peran_approver": "Manager",
  "catatan": "Struk belum lengkap"
}
```

Response `message: "Dokumen berhasil ditolak."`, `status: "ditolak"`.

### `GET /api/persetujuan/{targetType}/{targetId}/history` → 200 (auth)

Contoh `GET /persetujuan/pengajuan_perjalanan/2/history`:

```json
{
  "success": true,
  "message": "Riwayat persetujuan berhasil diambil.",
  "data": [
    { "id_persetujuan": 5, "approvable_type": "pengajuan_perjalanan", "approvable_id": 2, "id_user": 1, "nama_approver": "Admin Astronova", "peran_approver": "Manager", "status": "disetujui", "status_label": "Disetujui", "catatan": "OK", "approved_at": "2026-09-01T09:30:00.000000Z", "created_at": "2026-09-01T09:30:00.000000Z", "updated_at": "2026-09-01T09:30:00.000000Z" }
  ]
}
```

```js
import { apiFetch, setToken } from '$lib/api';
setToken('TOKEN_DARI_TINKER');
await apiFetch('/persetujuan/approve', { method: 'POST', auth: true, body: { approvable_type: 'pengajuan_perjalanan', approvable_id: 2, catatan: 'OK' } });
await apiFetch('/persetujuan/reject', { method: 'POST', auth: true, body: { approvable_type: 'pengajuan_penggantian', approvable_id: 1, catatan: 'Lengkapi' } });
await apiFetch('/persetujuan/pengajuan_perjalanan/2/history', { auth: true });
```

---

## 14. Bukti Struk (auth)

Resource (`BuktiStrukResource`): `{id_bukti_struk, id_pengeluaran, nama_asli, mime_type, ukuran (bytes), url (/storage/...), uploaded_at, created_at, updated_at}`.

### `POST /api/bukti-struk` → 201 (auth, multipart)

Form fields: `file* (jpg,jpeg,png,pdf max 5MB) + id_pengeluaran* exists`.

Response:

```json
{
  "success": true,
  "message": "Bukti struk berhasil diunggah.",
  "data": {
    "id_bukti_struk": 1,
    "id_pengeluaran": 1,
    "nama_asli": "struk_tiket_kai_001.jpg",
    "mime_type": "image/jpeg",
    "ukuran": 245760,
    "url": "http://127.0.0.1:8000/storage/bukti-struk/abc123.jpg",
    "uploaded_at": "2026-09-01T09:45:00.000000Z",
    "created_at": "2026-09-01T09:45:00.000000Z",
    "updated_at": "2026-09-01T09:45:00.000000Z"
  }
}
```

### `GET /api/pengeluaran/{idPengeluaran}/bukti-struk` → 200 (auth)

```json
{
  "success": true,
  "message": "Daftar bukti struk berhasil diambil.",
  "data": [
    { "id_bukti_struk": 1, "id_pengeluaran": 1, "nama_asli": "struk.jpg", "mime_type": "image/jpeg", "ukuran": 245760, "url": "http://127.0.0.1:8000/storage/bukti-struk/abc.jpg", "uploaded_at": "2026-09-01T09:45:00.000000Z", "created_at": "2026-09-01T09:45:00.000000Z", "updated_at": "2026-09-01T09:45:00.000000Z" }
  ]
}
```

### `DELETE /api/bukti-struk/{id}` → 200 (auth)

```json
{ "success": true, "message": "Bukti struk berhasil dihapus.", "data": null }
```

```js
const fd = new FormData();
fd.append('file', fileInput.files[0]);
fd.append('id_pengeluaran', '1');
await apiFetch('/bukti-struk', { method: 'POST', auth: true, body: fd });
await apiFetch('/pengeluaran/1/bukti-struk', { auth: true });
await apiFetch('/bukti-struk/1', { method: 'DELETE', auth: true });
```

---

## 15. Dokumen Pendukung (auth)

Resource (`DokumenPendukungResource`): `{id_dokumen, id_pengajuan, nama_asli, mime_type, ukuran, jenis_dokumen: surat_tugas|itinerary|undangan|lainnya, url, uploaded_at, created_at, updated_at}`.

### `POST /api/dokumen-pendukung` → 201 (auth, multipart)

Fields: `file* (pdf,doc,docx,jpg,jpeg,png max 10MB) + id_pengajuan* exists + jenis_dokumen* enum`.

Response:

```json
{
  "success": true,
  "message": "Dokumen pendukung berhasil diunggah.",
  "data": {
    "id_dokumen": 1,
    "id_pengajuan": 1,
    "nama_asli": "surat_tugas.pdf",
    "mime_type": "application/pdf",
    "ukuran": 512000,
    "jenis_dokumen": "surat_tugas",
    "url": "http://127.0.0.1:8000/storage/dokumen/xyz.pdf",
    "uploaded_at": "2026-09-01T09:40:00.000000Z",
    "created_at": "2026-09-01T09:40:00.000000Z",
    "updated_at": "2026-09-01T09:40:00.000000Z"
  }
}
```

### `GET /api/pengajuan-perjalanan/{idPengajuan}/dokumen` → 200 (auth)

```json
{
  "success": true,
  "message": "Daftar dokumen pendukung berhasil diambil.",
  "data": [
    { "id_dokumen": 1, "id_pengajuan": 1, "nama_asli": "surat_tugas.pdf", "mime_type": "application/pdf", "ukuran": 512000, "jenis_dokumen": "surat_tugas", "url": "http://127.0.0.1:8000/storage/dokumen/xyz.pdf", "uploaded_at": "2026-09-01T09:40:00.000000Z", "created_at": "2026-09-01T09:40:00.000000Z", "updated_at": "2026-09-01T09:40:00.000000Z" }
  ]
}
```

### `DELETE /api/dokumen-pendukung/{id}` → 200 (auth)

```json
{ "success": true, "message": "Dokumen pendukung berhasil dihapus.", "data": null }
```

```js
const fd = new FormData();
fd.append('file', f);
fd.append('id_pengajuan', '1');
fd.append('jenis_dokumen', 'surat_tugas');
await apiFetch('/dokumen-pendukung', { method: 'POST', auth: true, body: fd });
await apiFetch('/pengajuan-perjalanan/1/dokumen', { auth: true });
```

---

## 16. Log Audit (auth)

Resource (`LogAuditResource`): `{id_log, id_user, nama_user, model_type, model_id, action, old_values, new_values, ip_address, user_agent, created_at}`. Otomatis terisi via `AuditObserver` tiap create/update/delete model (user dari `auth:sanctum`).

### `GET /api/log-audit?per_page=15&id_user=&model_type=&action=` → 200 (auth)

```json
{
  "success": true,
  "message": "Data log audit berhasil diambil.",
  "data": {
    "data": [
      {
        "id_log": 1,
        "id_user": 1,
        "nama_user": "Admin Astronova",
        "model_type": "pengajuan_perjalanan",
        "model_id": 1,
        "action": "update",
        "old_values": { "status": "draft" },
        "new_values": { "status": "menunggu_persetujuan" },
        "ip_address": "127.0.0.1",
        "user_agent": "Mozilla/5.0",
        "created_at": "2026-09-01T10:00:00.000000Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### `GET /api/log-audit/{modelType}/{modelId}` → 200 (auth)

Contoh `GET /log-audit/pengajuan_perjalanan/1`: array item sama kayak di atas (tanpa paginasi).

```js
await apiFetch('/log-audit?per_page=15', { auth: true });
await apiFetch('/log-audit?model_type=pengajuan_perjalanan&action=update', { auth: true });
await apiFetch('/log-audit/pengajuan_perjalanan/1', { auth: true });
```

---

## 17. Error yang bakal ketemu di FE

```json
// 422 validasi perjalanan
{ "success": false, "message": "Validasi gagal.", "errors": { "tanggal_selesai": ["The tanggal selesai field must be a date after or equal to tanggal mulai."] } }
// 422 transisi status ilegal
{ "success": false, "message": "Transisi status tidak diizinkan.", "errors": {} }
// 404
{ "success": false, "message": "Pengajuan perjalanan tidak ditemukan.", "errors": {} }
// 401 (lupa Bearer di route auth)
{ "message": "Unauthenticated." }
```

Tampilkan: `if (!r.success) alert(r.message + ' ' + JSON.stringify(r.errors ?? {}))`.

Svelte pattern form + error:

```svelte
<script>
  import { apiFetch } from '$lib/api';
  let form = { nama_departemen: '' };
  let err = {};
  async function submit() {
    try { await apiFetch('/departemen', { method: 'POST', body: form }); }
    catch (e) { err = e.errors ?? {}; alert(e.message); }
  }
</script>
```

## 18. Urutan fetch FE disarankan + Postman

1. `GET /test` → BE hidup?
2. Master: departemen → karyawan → proyek → tujuan → kategori (id untuk dropdown form transaksi).
3. Transaksi: POST perjalanan → PATCH status menunggu → approve (auth) → POST pengeluaran → upload bukti (auth) → POST penggantian → approve.
4. History: persetujuan history + log-audit.

Koleksi siap import: `astronova_postman_collection.json` (variable `base_url`, 10 request master + health). Spec lama: `api-req.md` (abaikan nama field basi seperti `tanggal_berangkat`, `dibuat_pada`, `file_struk`, `tipe_entitas` — pakai docs ini).
