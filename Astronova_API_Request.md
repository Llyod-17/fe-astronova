# Astronova API Request & Response Specification

Format Umum Seluruh endpoint pada aplikasi ini menggunakan format JSON terstandar yang dikontrol melalui App\Http\Controllers\Controller.

**Success**

```json
{
	"success": true,
	"message": "Pesan deskripsi keberhasilan operasi.",
	"data": {}
}
```

**Error (404/422/500)**

```json
{
	"success": false,
	"message": "Validasi gagal.",
	"errors": {}
}
```

## 1. Modul Master Data

### 1.1 Departemen

#### `GET /api/departemen`

**Response 200**

```json
{
	"success": true,
	"message": "Daftar departemen berhasil diambil.",
	"data": [
		{
			"id_departemen": 1,
			"nama_departemen": "Teknologi Informasi",
			"dibuat_pada": "2026-09-01T08:00:00.000000Z",
			"karyawan_count": 5
		}
	]
}
```

#### `POST /api/departemen`

**Request**

```json
{
	"nama_departemen": "Keuangan & Akuntansi"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Departemen berhasil ditambahkan.",
	"data": {
		"id_departemen": 2,
		"nama_departemen": "Keuangan & Akuntansi",
		"dibuat_pada": "2026-09-01T08:15:00.000000Z"
	}
}
```

#### `GET /api/departemen/{id}`

**Response 200**

```json
{
	"success": true,
	"message": "Detail departemen berhasil diambil.",
	"data": {
		"id_departemen": 1,
		"nama_departemen": "Teknologi Informasi",
		"dibuat_pada": "2026-09-01T08:00:00.000000Z",
		"karyawan": [
			{
				"id_karyawan": 1,
				"nik": "EMP-001",
				"nama_lengkap": "Budi Santoso",
				"email": "budi@example.com",
				"telepon": "08123456789",
				"id_departemen": 1,
				"peran": "staff",
				"dibuat_pada": "2026-09-01T08:05:00.000000Z"
			}
		]
	}
}
```

### 1.2 Kategori Pengeluaran

#### `POST /api/kategori-pengeluaran`

**Request**

```json
{
	"nama_kategori": "Transportasi",
	"deskripsi": "Tiket pesawat, kereta, taksi, bensin, dan tol"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Kategori pengeluaran berhasil ditambahkan.",
	"data": {
		"id_kategori": 1,
		"nama_kategori": "Transportasi",
		"deskripsi": "Tiket pesawat, kereta, taksi, bensin, dan tol",
		"dibuat_pada": "2026-09-01T08:00:00.000000Z"
	}
}
```

### 1.3 Proyek

#### `POST /api/proyek`

**Request**

```json
{
	"nama_proyek": "Implementasi Core Banking System",
	"kode_proyek": "PRJ-2026-001"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Proyek berhasil ditambahkan.",
	"data": {
		"id_proyek": 1,
		"nama_proyek": "Implementasi Core Banking System",
		"kode_proyek": "PRJ-2026-001",
		"dibuat_pada": "2026-09-01T08:00:00.000000Z"
	}
}
```

### 1.4 Tujuan Perjalanan

#### `POST /api/tujuan`

**Request**

```json
{
	"nama_tujuan": "Kantor Cabang Surabaya",
	"kota": "Surabaya",
	"negara": "Indonesia"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Tujuan berhasil ditambahkan.",
	"data": {
		"id_tujuan": 1,
		"nama_tujuan": "Kantor Cabang Surabaya",
		"kota": "Surabaya",
		"negara": "Indonesia",
		"dibuat_pada": "2026-09-01T08:00:00.000000Z"
	}
}
```

### 1.5 Karyawan

#### `POST /api/karyawan`

**Request**

```json
{
	"nik": "EMP-2026-001",
	"nama_lengkap": "Ahmad Fauzi",
	"email": "ahmad.fauzi@perusahaan.com",
	"telepon": "081234567890",
	"id_departemen": 1,
	"peran": "staff"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Karyawan berhasil ditambahkan.",
	"data": {
		"id_karyawan": 1,
		"nik": "EMP-2026-001",
		"nama_lengkap": "Ahmad Fauzi",
		"email": "ahmad.fauzi@perusahaan.com",
		"telepon": "081234567890",
		"id_departemen": 1,
		"peran": "staff",
		"dibuat_pada": "2026-09-01T08:00:00.000000Z",
		"departemen": {
			"id_departemen": 1,
			"nama_departemen": "Teknologi Informasi",
			"dibuat_pada": "2026-09-01T07:00:00.000000Z"
		}
	}
}
```

## 2. Modul Transaksi & Operasional

### 2.1 Pengajuan Perjalanan

#### `POST /api/pengajuan-perjalanan`

**Request**

```json
{
	"id_karyawan": 1,
	"id_proyek": 1,
	"id_tujuan": 1,
	"tanggal_berangkat": "2026-09-10",
	"tanggal_kembali": "2026-09-15",
	"tujuan_perjalanan": "Instalasi server on-site di Surabaya",
	"status": "menunggu_persetujuan",
	"anggaran_estimasi": 5000000.0
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Pengajuan perjalanan berhasil dibuat.",
	"data": {
		"id_pengajuan": 1,
		"id_karyawan": 1,
		"id_proyek": 1,
		"id_tujuan": 1,
		"tanggal_berangkat": "2026-09-10",
		"tanggal_kembali": "2026-09-15",
		"tujuan_perjalanan": "Instalasi server on-site di Surabaya",
		"status": "menunggu_persetujuan",
		"anggaran_estimasi": "5000000.00",
		"dibuat_pada": "2026-09-01T08:30:00.000000Z",
		"diperbarui_pada": "2026-09-01T08:30:00.000000Z",
		"karyawan": {
			"id_karyawan": 1,
			"nik": "EMP-2026-001",
			"nama_lengkap": "Ahmad Fauzi"
		},
		"proyek": {
			"id_proyek": 1,
			"nama_proyek": "Implementasi Core Banking System",
			"kode_proyek": "PRJ-2026-001"
		},
		"tujuan": {
			"id_tujuan": 1,
			"nama_tujuan": "Kantor Cabang Surabaya",
			"kota": "Surabaya",
			"negara": "Indonesia"
		}
	}
}
```

#### `GET /api/pengajuan-perjalanan/{id}`

**Response 200**

```json
{
	"success": true,
	"message": "Detail pengajuan perjalanan berhasil diambil.",
	"data": {
		"id_pengajuan": 1,
		"id_karyawan": 1,
		"id_proyek": 1,
		"id_tujuan": 1,
		"tanggal_berangkat": "2026-09-10",
		"tanggal_kembali": "2026-09-15",
		"tujuan_perjalanan": "Instalasi server on-site di Surabaya",
		"status": "menunggu_persetujuan",
		"anggaran_estimasi": "5000000.00",
		"dibuat_pada": "2026-09-01T08:30:00.000000Z",
		"diperbarui_pada": "2026-09-01T08:30:00.000000Z",
		"karyawan": {},
		"proyek": {},
		"tujuan": {},
		"pengeluaran_perjalanan": [
			{
				"id_pengeluaran": 1,
				"id_pengajuan": 1,
				"id_kategori": 1,
				"tanggal_pengeluaran": "2026-09-10",
				"deskripsi": "Tiket Pesawat Garuda Indonesia",
				"jumlah": "1750000.00",
				"metode_pembayaran": "transfer",
				"sudah_diganti": false,
				"kategori_pengeluaran": {},
				"bukti_struk": []
			}
		],
		"pengajuan_penggantian": [],
		"riwayat_persetujuan": [],
		"dokumen_pendukung": []
	}
}
```

### 2.2 Pengeluaran Perjalanan

#### `POST /api/pengeluaran-perjalanan`

**Request**

```json
{
	"id_pengajuan": 1,
	"id_kategori": 1,
	"tanggal_pengeluaran": "2026-09-10",
	"deskripsi": "Tiket Kereta Eksekutif",
	"jumlah": 600000.0,
	"metode_pembayaran": "transfer",
	"sudah_diganti": false
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Pengeluaran perjalanan berhasil dicatat.",
	"data": {
		"id_pengeluaran": 1,
		"id_pengajuan": 1,
		"id_kategori": 1,
		"tanggal_pengeluaran": "2026-09-10",
		"deskripsi": "Tiket Kereta Eksekutif",
		"jumlah": "600000.00",
		"metode_pembayaran": "transfer",
		"sudah_diganti": false,
		"dibuat_pada": "2026-09-01T08:45:00.000000Z",
		"pengajuan_perjalanan": {},
		"kategori_pengeluaran": {},
		"bukti_struk": []
	}
}
```

### 2.3 Pengajuan Penggantian (Reimbursement)

#### `POST /api/pengajuan-penggantian`

**Request**

```json
{
	"id_pengajuan": 1,
	"id_karyawan": 1,
	"jumlah_uang_muka": 2000000.0,
	"total_pengeluaran": 2750000.0,
	"jumlah_penggantian": 750000.0,
	"status": "diajukan",
	"diproses_pada": null
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Pengajuan penggantian berhasil dibuat.",
	"data": {
		"id_penggantian": 1,
		"id_pengajuan": 1,
		"id_karyawan": 1,
		"jumlah_uang_muka": "2000000.00",
		"total_pengeluaran": "2750000.00",
		"jumlah_penggantian": "750000.00",
		"status": "diajukan",
		"diproses_pada": null,
		"dibuat_pada": "2026-09-01T09:00:00.000000Z",
		"pengajuan_perjalanan": {},
		"karyawan": {}
	}
}
```

### 2.4 Riwayat Persetujuan

#### `POST /api/riwayat-persetujuan`

**Request**

```json
{
	"id_pengajuan": 1,
	"id_penyetuju": 2,
	"tingkat_persetujuan": 1,
	"status": "disetujui",
	"catatan": "Pengajuan dinas disetujui untuk dilaksanakan sesuai jadwal.",
	"disetujui_pada": "2026-09-01 09:30:00"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Riwayat persetujuan berhasil dicatat.",
	"data": {
		"id_persetujuan": 1,
		"id_pengajuan": 1,
		"id_penyetuju": 2,
		"tingkat_persetujuan": 1,
		"status": "disetujui",
		"catatan": "Pengajuan dinas disetujui untuk dilaksanakan sesuai jadwal.",
		"disetujui_pada": "2026-09-01T09:30:00.000000Z",
		"dibuat_pada": "2026-09-01T09:30:00.000000Z",
		"pengajuan_perjalanan": {},
		"penyetuju": {
			"id_karyawan": 2,
			"nama_lengkap": "Manager Operasional",
			"peran": "manajer"
		}
	}
}
```

## 3. Modul Dokumen & Log

### 3.1 Dokumen Pendukung

#### `POST /api/dokumen-pendukung`

**Request**

```json
{
	"id_pengajuan": 1,
	"tipe_dokumen": "Surat Tugas Resmi",
	"nama_file": "surat_tugas_surabaya_2026.pdf",
	"path_file": "uploads/documents/surat_tugas_surabaya_2026.pdf"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Dokumen pendukung berhasil ditambahkan.",
	"data": {
		"id_dokumen": 1,
		"id_pengajuan": 1,
		"tipe_dokumen": "Surat Tugas Resmi",
		"nama_file": "surat_tugas_surabaya_2026.pdf",
		"path_file": "uploads/documents/surat_tugas_surabaya_2026.pdf",
		"diunggah_pada": "2026-09-01T09:40:00.000000Z",
		"pengajuan_perjalanan": {}
	}
}
```

### 3.2 Bukti Struk

#### `POST /api/bukti-struk`

**Request**

```json
{
	"id_pengeluaran": 1,
	"file_struk": "uploads/receipts/struk_tiket_kai_001.jpg"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Bukti struk berhasil ditambahkan.",
	"data": {
		"id_bukti": 1,
		"id_pengeluaran": 1,
		"file_struk": "uploads/receipts/struk_tiket_kai_001.jpg",
		"diunggah_pada": "2026-09-01T09:45:00.000000Z",
		"pengeluaran_perjalanan": {}
	}
}
```

### 3.3 Log Audit

#### `POST /api/log-audit`

**Request**

```json
{
	"id_pengguna": 1,
	"aksi": "PERUBAHAN_STATUS_PENGAJUAN",
	"tipe_entitas": "pengajuan_perjalanan",
	"id_entitas": 1,
	"nilai_lama": "{\"status\":\"draft\"}",
	"nilai_baru": "{\"status\":\"menunggu_persetujuan\"}",
	"alamat_ip": "192.168.1.50"
}
```

**Response 201**

```json
{
	"success": true,
	"message": "Log audit berhasil dicatat.",
	"data": {
		"id_log": 1,
		"id_pengguna": 1,
		"aksi": "PERUBAHAN_STATUS_PENGAJUAN",
		"tipe_entitas": "pengajuan_perjalanan",
		"id_entitas": 1,
		"nilai_lama": "{\"status\":\"draft\"}",
		"nilai_baru": "{\"status\":\"menunggu_persetujuan\"}",
		"alamat_ip": "192.168.1.50",
		"dibuat_pada": "2026-09-01T10:00:00.000000Z",
		"pengguna": {
			"id_karyawan": 1,
			"nama_lengkap": "Ahmad Fauzi",
			"peran": "staff"
		}
	}
}
```

## 4. Error Response & Status Codes

**404 Not Found**

```json
{
	"success": false,
	"message": "Pengajuan perjalanan tidak ditemukan.",
	"errors": {}
}
```

**422 Validation Error**

```json
{
	"success": false,
	"message": "Validasi gagal.",
	"errors": {
		"id_karyawan": ["The id karyawan field is required."],
		"tanggal_kembali": [
			"The tanggal kembali field must be a date after or equal to tanggal berangkat."
		]
	}
}
```

**HTTP Status Codes Reference:**

200 OK: Pengambilan data (GET), pembaruan data (PUT/PATCH), penghapusan data (DELETE).

201 Created: Resource baru berhasil dibuat di database (POST).

404 Not Found: Resource dengan ID yang diminta tidak ditemukan.

422 Unprocessable Content: Data input dari klien gagal memenuhi aturan validasi.

500 Internal Server Error: Kesalahan pada server backend.
