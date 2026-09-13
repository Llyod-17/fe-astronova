export type Role = 'karyawan' | 'atasan' | 'admin-travel' | 'finance' | 'superadmin';

export interface User {
	id: number;
	nama: string;
	nik: string;
	jabatan: string;
	departemen: string;
	email: string;
	peran: Role;
}

export type TripStatus =
	'draft' | 'menunggu_persetujuan' | 'disetujui' | 'berlangsung' | 'selesai' | 'ditolak';

export interface Trip {
	id: string;
	karyawanId: number;
	tujuan: string;
	kota: string;
	berangkat: string;
	kembali: string;
	keperluan: string;
	anggaran: number;
	uangMuka: number;
	status: TripStatus;
	level: number;
	proyek: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
	id: string;
	tripId: string;
	jenis: 'Tiket Pesawat' | 'Kereta' | 'Hotel' | 'Transportasi';
	detail: string;
	nomorRef: string;
	vendor: string;
	harga: number;
	status: BookingStatus;
}

export interface ItineraryItem {
	id: string;
	tripId: string;
	waktu: string;
	aktivitas: string;
	lokasi: string;
}

export type FundStatus = 'diajukan' | 'dicairkan';

export interface UangMuka {
	id: string;
	tripId: string;
	diajukan: number;
	disetujui: number;
	status: FundStatus;
	tanggal: string;
}

export interface Reimbursement {
	id: string;
	tripId: string;
	kategori: string;
	deskripsi: string;
	jumlah: number;
	status: 'diajukan' | 'diverifikasi' | 'siap_bayar' | 'selesai';
	bukti: string;
}

export interface Settlement {
	id: string;
	tripId: string;
	status: 'diajukan' | 'diverifikasi' | 'selesai';
	totalRealisasi: number;
}

export interface Vendor {
	id: number;
	nama: string;
	kategori: string;
	kontak: string;
	rating: number;
}

export interface Policy {
	id: number;
	latarbelakang: string;
	grade: string;
	limit: number;
	kelas: string;
}

export interface AuditEntry {
	id: number;
	waktu: string;
	aktor: string;
	aksi: string;
	entitas: string;
	ip: string;
}

export interface Notif {
	id: number;
	judul: string;
	isidata: string;
	waktu: string;
	dibaca: boolean;
}

export interface Dept {
	id: number;
	nama: string;
	count: number;
}

export interface MCategory {
	id: number;
	nama: string;
	deskripsi: string;
}

export interface MProject {
	id: number;
	nama: string;
	kode: string;
}

export interface MDestination {
	id: number;
	nama: string;
	kota: string;
	negara: string;
}
