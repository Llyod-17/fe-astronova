import type {
	AuditEntry,
	Booking,
	Dept,
	ItineraryItem,
	MCategory,
	MDestination,
	MProject,
	Notif,
	Policy,
	Reimbursement,
	Settlement,
	Trip,
	UangMuka,
	User,
	Vendor
} from '../types';

export const USERS: User[] = [
	{
		id: 1,
		nama: 'Ahmad Fauzi',
		nik: 'EMP-2026-001',
		jabatan: 'Staff IT',
		departemen: 'Teknologi Informasi',
		email: 'ahmad@astronova.id',
		peran: 'karyawan'
	},
	{
		id: 2,
		nama: 'Siti Rahmawati',
		nik: 'EMP-2026-002',
		jabatan: 'Manager Operasional',
		departemen: 'Operasional',
		email: 'siti.rahma@astronova.id',
		peran: 'atasan'
	},
	{
		id: 3,
		nama: 'Rizky Aditya',
		nik: 'EMP-2026-003',
		jabatan: 'Admin Travel',
		departemen: 'Travel',
		email: 'rizky.adit@astronova.id',
		peran: 'admin-travel'
	},
	{
		id: 4,
		nama: 'Dewi Kusuma',
		nik: 'EMP-2026-004',
		jabatan: 'Finance Officer',
		departemen: 'Keuangan',
		email: 'dewi.kusuma@astronova.id',
		peran: 'finance'
	},
	{
		id: 5,
		nama: 'Budi Hartono',
		nik: 'EMP-2026-005',
		jabatan: 'Super Admin',
		departemen: 'IT',
		email: 'budi.hartono@astronova.id',
		peran: 'superadmin'
	}
];

export function userByRole(role: string): User {
	return USERS.find((u) => u.peran === role) ?? USERS[0];
}

export const TRIPS: Trip[] = [
	{
		id: 'TRIP-2026-001',
		karyawanId: 1,
		tujuan: 'Kantor Cabang Surabaya',
		kota: 'Surabaya',
		berangkat: '2026-09-15',
		kembali: '2026-09-20',
		keperluan: 'Instalasi server on-site',
		anggaran: 5_000_000,
		uangMuka: 3_000_000,
		status: 'berlangsung',
		level: 1,
		proyek: 'Core Banking System'
	},
	{
		id: 'TRIP-2026-002',
		karyawanId: 1,
		tujuan: 'Training AWS Jakarta',
		kota: 'Jakarta',
		berangkat: '2026-10-05',
		kembali: '2026-10-07',
		keperluan: 'AWS certification training',
		anggaran: 3_500_000,
		uangMuka: 2_000_000,
		status: 'menunggu_persetujuan',
		level: 1,
		proyek: 'Cloud Migration'
	},
	{
		id: 'TRIP-2026-003',
		karyawanId: 1,
		tujuan: 'Auditor Internal',
		kota: 'Bandung',
		berangkat: '2026-08-20',
		kembali: '2026-08-22',
		keperluan: 'Audit infrastruktur data center',
		anggaran: 2_500_000,
		uangMuka: 2_500_000,
		status: 'selesai',
		level: 1,
		proyek: 'IT Audit Q3'
	},
	{
		id: 'TRIP-2026-004',
		karyawanId: 1,
		tujuan: 'Roadshow Medan',
		kota: 'Medan',
		berangkat: '2026-07-10',
		kembali: '2026-07-14',
		keperluan: 'Implementasi branch network',
		anggaran: 4_200_000,
		uangMuka: 3_500_000,
		status: 'selesai',
		level: 1,
		proyek: 'Branch Expansion'
	},
	{
		id: 'TRIP-2026-005',
		karyawanId: 1,
		tujuan: 'Konferensi Digital Banking',
		kota: 'Bali',
		berangkat: '2026-09-25',
		kembali: '2026-09-28',
		keperluan: 'Menghadiri konferensi dan pameran fintech',
		anggaran: 8_000_000,
		uangMuka: 4_000_000,
		status: 'disetujui',
		level: 1,
		proyek: 'Digital Banking'
	},
	{
		id: 'TRIP-2026-006',
		karyawanId: 1,
		tujuan: 'Sosialisasi di Pontianak',
		kota: 'Pontianak',
		berangkat: '2026-11-10',
		kembali: '2026-11-12',
		keperluan: 'Sosialisasi sistem baru',
		anggaran: 3_000_000,
		uangMuka: 0,
		status: 'draft',
		level: 0,
		proyek: 'Core Banking System'
	},
	{
		id: 'TRIP-2026-007',
		karyawanId: 1,
		tujuan: 'Kantor Cabang Makassar',
		kota: 'Makassar',
		berangkat: '2026-09-12',
		kembali: '2026-09-16',
		keperluan: 'Monitoring penyelesaian fitur',
		anggaran: 6_000_000,
		uangMuka: 2_000_000,
		status: 'berlangsung',
		level: 1,
		proyek: 'Core Banking System'
	},
	{
		id: 'TRIP-2026-008',
		karyawanId: 1,
		tujuan: 'Meeting Klien di Tokyo',
		kota: 'Tokyo',
		berangkat: '2026-10-15',
		kembali: '2026-10-20',
		keperluan: 'Negosiasi kemitraan',
		anggaran: 15_000_000,
		uangMuka: 0,
		status: 'ditolak',
		level: 1,
		proyek: 'International Partnership'
	}
];

export const BOOKINGS: Booking[] = [
	{
		id: 'BK-2026-001',
		tripId: 'TRIP-2026-001',
		jenis: 'Tiket Pesawat',
		detail: 'CGK → SUB — Garuda GA-312',
		nomorRef: 'GA-29018',
		vendor: 'Garuda Indonesia',
		harga: 1_750_000,
		status: 'confirmed'
	},
	{
		id: 'BK-2026-002',
		tripId: 'TRIP-2026-001',
		jenis: 'Hotel',
		detail: 'Hotel Swarna — Deluxe Room 4 malam',
		nomorRef: 'SVR-20260915',
		vendor: 'Swarna Hotel',
		harga: 1_200_000,
		status: 'confirmed'
	},
	{
		id: 'BK-2026-003',
		tripId: 'TRIP-2026-007',
		jenis: 'Tiket Pesawat',
		detail: 'CGK → UPY — Lion Air JT-901',
		nomorRef: 'LA-88123',
		vendor: 'Lion Air',
		harga: 1_500_000,
		status: 'confirmed'
	},
	{
		id: 'BK-2026-004',
		tripId: 'TRIP-2026-005',
		jenis: 'Tiket Pesawat',
		detail: 'CGK → DPS — Citilink QG-664',
		nomorRef: 'CT-44192',
		vendor: 'Citilink',
		harga: 1_800_000,
		status: 'pending'
	},
	{
		id: 'BK-2026-005',
		tripId: 'TRIP-2026-005',
		jenis: 'Hotel',
		detail: 'Padma Resort Ubud — Standard Suite 3 malam',
		nomorRef: 'PDR-9087',
		vendor: 'Padma Resort',
		harga: 2_400_000,
		status: 'pending'
	}
];

export const ITINERARY: ItineraryItem[] = [
	{
		id: 'ITN-1',
		tripId: 'TRIP-2026-001',
		waktu: '15 Sep 08:00',
		aktivitas: 'Keberangkatan CGK → SUB',
		lokasi: 'Terminal 3, Soekarno-Hatta'
	},
	{
		id: 'ITN-2',
		tripId: 'TRIP-2026-001',
		waktu: '15 Sep 10:30',
		aktivitas: 'Check-in Hotel Swarna',
		lokasi: 'Hotel Swarna, Surabaya'
	},
	{
		id: 'ITN-3',
		tripId: 'TRIP-2026-001',
		waktu: '16 Sep 09:00',
		aktivitas: 'Instalasi rack server',
		lokasi: 'Data Center Surabaya'
	},
	{
		id: 'ITN-4',
		tripId: 'TRIP-2026-001',
		waktu: '17 Sep 09:00',
		aktivitas: 'Konfigurasi jaringan',
		lokasi: 'Data Center Surabaya'
	},
	{
		id: 'ITN-5',
		tripId: 'TRIP-2026-001',
		waktu: '18 Sep 09:00',
		aktivitas: 'Uji fungsi sistem',
		lokasi: 'Data Center Surabaya'
	},
	{
		id: 'ITN-6',
		tripId: 'TRIP-2026-001',
		waktu: '19 Sep 14:00',
		aktivitas: 'Check-out & keberangkatan',
		lokasi: 'Juanda Airport'
	},
	{
		id: 'ITN-7',
		tripId: 'TRIP-2026-007',
		waktu: '12 Sep 07:00',
		aktivitas: 'Keberangkatan CGK → UPY',
		lokasi: 'Soekarno-Hatta'
	},
	{
		id: 'ITN-8',
		tripId: 'TRIP-2026-007',
		waktu: '12 Sep 11:00',
		aktivitas: 'Kunjungan site',
		lokasi: 'Branch Office Makassar'
	},
	{
		id: 'ITN-9',
		tripId: 'TRIP-2026-007',
		waktu: '13 Sep 09:00',
		aktivitas: 'Sosialisasi tim lokal',
		lokasi: 'Ruang Rapat Makassar'
	},
	{
		id: 'ITN-10',
		tripId: 'TRIP-2026-007',
		waktu: '14 Sep 08:00',
		aktivitas: 'UAT fitur baru',
		lokasi: 'Branch Office Makassar'
	}
];

export const DANA: UangMuka[] = [
	{
		id: 'UM-001',
		tripId: 'TRIP-2026-001',
		diajukan: 3_000_000,
		disetujui: 3_000_000,
		status: 'dicairkan',
		tanggal: '2026-09-12'
	},
	{
		id: 'UM-002',
		tripId: 'TRIP-2026-003',
		diajukan: 2_500_000,
		disetujui: 2_500_000,
		status: 'dicairkan',
		tanggal: '2026-08-18'
	},
	{
		id: 'UM-003',
		tripId: 'TRIP-2026-004',
		diajukan: 3_500_000,
		disetujui: 3_000_000,
		status: 'dicairkan',
		tanggal: '2026-07-08'
	},
	{
		id: 'UM-004',
		tripId: 'TRIP-2026-005',
		diajukan: 4_000_000,
		disetujui: 3_500_000,
		status: 'diajukan',
		tanggal: '2026-09-20'
	},
	{
		id: 'UM-005',
		tripId: 'TRIP-2026-002',
		diajukan: 2_000_000,
		disetujui: 0,
		status: 'diajukan',
		tanggal: '2026-09-28'
	}
];

export const REIMBURSEMENTS: Reimbursement[] = [
	{
		id: 'RB-001',
		tripId: 'TRIP-2026-003',
		kategori: 'Transportasi Lokal',
		deskripsi: 'Grab dari bandara ke hotel',
		jumlah: 150_000,
		status: 'selesai',
		bukti: 'grab_ct_001.jpg'
	},
	{
		id: 'RB-002',
		tripId: 'TRIP-2026-003',
		kategori: 'Makan',
		deskripsi: 'Makan siang rapat internal',
		jumlah: 125_000,
		status: 'selesai',
		bukti: 'makan_bdg.jpg'
	},
	{
		id: 'RB-003',
		tripId: 'TRIP-2026-001',
		kategori: 'Konsumsi',
		deskripsi: 'Snack & minuman meeting',
		jumlah: 250_000,
		status: 'diverifikasi',
		bukti: 'snack_bukti.pdf'
	},
	{
		id: 'RB-004',
		tripId: 'TRIP-2026-004',
		kategori: 'Transportasi Lokal',
		deskripsi: 'Taksi bandara - kantor',
		jumlah: 200_000,
		status: 'siap_bayar',
		bukti: 'taksijkt.jpg'
	},
	{
		id: 'RB-005',
		tripId: 'TRIP-2026-004',
		kategori: 'Dokumentasi',
		deskripsi: 'Cetak dokumen untuk presentasi',
		jumlah: 85_000,
		status: 'diajukan',
		bukti: 'cetak_bukti.pdf'
	}
];

export const SETTLEMENTS: Settlement[] = [
	{ id: 'STL-001', tripId: 'TRIP-2026-003', status: 'selesai', totalRealisasi: 1_950_000 },
	{ id: 'STL-002', tripId: 'TRIP-2026-004', status: 'diverifikasi', totalRealisasi: 3_850_000 },
	{ id: 'STL-003', tripId: 'TRIP-2026-001', status: 'diajukan', totalRealisasi: 0 }
];

export const VENDORS: Vendor[] = [
	{ id: 1, nama: 'Garuda Indonesia', kategori: 'Maskapai', kontak: 'cs@garuda.co.id', rating: 4.5 },
	{ id: 2, nama: 'Lion Air', kategori: 'Maskapai', kontak: 'support@lionair.co.id', rating: 3.8 },
	{ id: 3, nama: 'Swarna Hotel', kategori: 'Hotel', kontak: 'reservation@swarna.id', rating: 4.2 },
	{
		id: 4,
		nama: 'Padma Resort',
		kategori: 'Hotel',
		kontak: 'booking@padmaresort.com',
		rating: 4.7
	},
	{ id: 5, nama: 'Citilink', kategori: 'Maskapai', kontak: 'help@citilink.com', rating: 3.9 },
	{
		id: 6,
		nama: 'Traveloka',
		kategori: 'Agen Tiket',
		kontak: 'corporate@traveloka.com',
		rating: 4.4
	},
	{ id: 7, nama: 'Grab', kategori: 'Transportasi Lokal', kontak: 'partner@grab.com', rating: 4.3 }
];

export const POLICIES: Policy[] = [
	{ id: 1, latarbelakang: 'Level pekerja', grade: 'Staff', limit: 3_000_000, kelas: 'Ekonomi' },
	{
		id: 2,
		latarbelakang: 'Level pekerja',
		grade: 'Senior Staff',
		limit: 5_000_000,
		kelas: 'Ekonomi Premium'
	},
	{ id: 3, latarbelakang: 'Level pekerja', grade: 'Manager', limit: 8_000_000, kelas: 'Bisnis' },
	{ id: 4, latarbelakang: 'Level pekerja', grade: 'Direktur', limit: 15_000_000, kelas: 'Bisnis' },
	{ id: 5, latarbelakang: 'Standar', grade: 'International', limit: 20_000_000, kelas: 'Bisnis' }
];

export const AUDIT_LOG: AuditEntry[] = [
	{
		id: 1,
		waktu: '2026-09-13T08:15:00Z',
		aktor: 'Siti Rahmawati',
		aksi: 'APPROVE_PENGAJUAN',
		entitas: 'TRIP-2026-001',
		ip: '10.12.1.15'
	},
	{
		id: 2,
		waktu: '2026-09-12T16:30:00Z',
		aktor: 'Dewi Kusuma',
		aksi: 'CAIRKAN_UANG_MUKA',
		entitas: 'UM-001',
		ip: '10.12.2.32'
	},
	{
		id: 3,
		waktu: '2026-09-11T10:22:00Z',
		aktor: 'Rizky Aditya',
		aksi: 'BUAT_BOOKING',
		entitas: 'BK-2026-001',
		ip: '10.12.1.88'
	},
	{
		id: 4,
		waktu: '2026-09-10T09:05:00Z',
		aktor: 'Ahmad Fauzi',
		aksi: 'SUBMIT_PENGAJUAN',
		entitas: 'TRIP-2026-005',
		ip: '10.12.1.50'
	},
	{
		id: 5,
		waktu: '2026-09-09T14:45:00Z',
		aktor: 'Budi Hartono',
		aksi: 'UPDATE_TRAVEL_POLICY',
		entitas: 'POL-003',
		ip: '10.12.0.1'
	},
	{
		id: 6,
		waktu: '2026-09-08T11:12:00Z',
		aktor: 'Dewi Kusuma',
		aksi: 'VERIFIKASI_REIMBURSEMENT',
		entitas: 'RB-003',
		ip: '10.12.2.32'
	},
	{
		id: 7,
		waktu: '2026-09-07T08:30:00Z',
		aktor: 'Siti Rahmawati',
		aksi: 'DELEGASI_APPROVAL',
		entitas: 'Siti → Rizky',
		ip: '10.12.1.15'
	},
	{
		id: 8,
		waktu: '2026-09-06T13:50:00Z',
		aktor: 'Budi Hartono',
		aksi: 'CREATE_USER',
		entitas: 'EMP-2026-005',
		ip: '10.12.0.1'
	}
];

export const NOTIF: Notif[] = [
	{
		id: 1,
		judul: 'Pengajuan disetujui',
		isidata: 'Pengajuan TRIP-2026-005 disetujui oleh Siti Rahmawati',
		waktu: '1 jam lalu',
		dibaca: false
	},
	{
		id: 2,
		judul: 'Booking dikonfirmasi',
		isidata: 'BK-2026-003 telah dikonfirmasi vendor Lion Air',
		waktu: '3 jam lalu',
		dibaca: false
	},
	{
		id: 3,
		judul: 'Uang muka dicairkan',
		isidata: 'Dana Rp3.000.000 untuk TRIP-2026-001 telah dicairkan',
		waktu: 'Kemarin',
		dibaca: true
	},
	{
		id: 4,
		judul: 'Reimbursement diverifikasi',
		isidata: 'RB-003 telah diverifikasi dan siap dibayar',
		waktu: 'Kemarin',
		dibaca: true
	},
	{
		id: 5,
		judul: 'Pengajuan ditolak',
		isidata: 'TRIP-2026-008 ditolak: anggaran melebihi batas',
		waktu: '3 hari lalu',
		dibaca: true
	},
	{
		id: 6,
		judul: 'Pengingat settlement',
		isidata: 'TRIP-2026-003 harus submit settlement dalam 2 hari',
		waktu: '3 hari lalu',
		dibaca: true
	}
];

export const DEPARTMENTS: Dept[] = [
	{ id: 1, nama: 'Teknologi Informasi', count: 24 },
	{ id: 2, nama: 'Keuangan & Akuntansi', count: 18 },
	{ id: 3, nama: 'Operasional', count: 32 },
	{ id: 4, nama: 'Sumber Daya Manusia', count: 12 },
	{ id: 5, nama: 'Marketing', count: 15 },
	{ id: 6, nama: 'Risk & Compliance', count: 8 }
];

export const KATEGORI: MCategory[] = [
	{ id: 1, nama: 'Transportasi', deskripsi: 'Tiket pesawat, kereta, taksi, bensin, tol' },
	{ id: 2, nama: 'Akomodasi', deskripsi: 'Hotel, penginapan, sewa rumah' },
	{ id: 3, nama: 'Makan & Minum', deskripsi: 'Biaya makan saat perjalanan dinas' },
	{ id: 4, nama: 'Konsumsi', deskripsi: 'Snack, minuman rapat, coffee break' },
	{ id: 5, nama: 'Dokumentasi', deskripsi: 'Cetak, foto, video, alat presentasi' }
];

export const PROYEKS: MProject[] = [
	{ id: 1, nama: 'Core Banking System', kode: 'PRJ-2026-001' },
	{ id: 2, nama: 'Cloud Migration', kode: 'PRJ-2026-002' },
	{ id: 3, nama: 'Branch Expansion', kode: 'PRJ-2026-003' },
	{ id: 4, nama: 'Digital Banking', kode: 'PRJ-2026-004' },
	{ id: 5, nama: 'IT Audit Q3', kode: 'PRJ-2026-005' }
];

export const DESTINASI: MDestination[] = [
	{ id: 1, nama: 'Kantor Cabang Surabaya', kota: 'Surabaya', negara: 'Indonesia' },
	{ id: 2, nama: 'AWS Training Center', kota: 'Jakarta', negara: 'Indonesia' },
	{ id: 3, nama: 'Data Center Bandung', kota: 'Bandung', negara: 'Indonesia' },
	{ id: 4, nama: 'Branch Office Medan', kota: 'Medan', negara: 'Indonesia' },
	{ id: 5, nama: 'Padma Resort Ubud', kota: 'Bali', negara: 'Indonesia' },
	{ id: 6, nama: 'Branch Office Makassar', kota: 'Makassar', negara: 'Indonesia' }
];

export const DELEGASI_ACTIVE = {
	dari: 'Siti Rahmawati',
	kepada: 'Rizky Aditya',
	dari_tgl: '2026-09-14',
	sampai_tgl: '2026-09-21',
	alasan: 'Cuti tahunan'
};
