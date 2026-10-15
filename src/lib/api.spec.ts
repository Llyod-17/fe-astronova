import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
	apiFetch,
	setToken,
	mapPengajuanToTrip,
	mapPenggantianToReimb,
	mapLogToAudit,
	mapUserToSession,
	mapVendorToFE,
	mapPolicyToFE,
	mapBookingToFE,
	mapUangMukaToFE,
	mapSettlementToFE,
	unwrap
} from './api';

beforeEach(() => {
	setToken(null);
	vi.unstubAllGlobals();
});

describe('apiFetch envelope', () => {
	it('returns data on success', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => ({
				status: 200,
				json: async () => ({ success: true, message: 'ok', data: [{ id: 1 }] })
			}))
		);
		const r = await apiFetch('/departemen');
		expect(r.data).toEqual([{ id: 1 }]);
	});

	it('throws {status,message,errors} on !success', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => ({
				status: 422,
				json: async () => ({ success: false, message: 'Validasi gagal.', errors: {} })
			}))
		);
		await expect(apiFetch('/departemen')).rejects.toMatchObject({ status: 422 });
	});

	it('sends Bearer when auth=true', async () => {
		const f = vi.fn(async () => ({
			status: 200,
			json: async () => ({ success: true, message: 'ok', data: [] })
		}));
		vi.stubGlobal('fetch', f);
		setToken('TOK123');
		await apiFetch('/log-audit?per_page=15', { auth: true });
		expect((f.mock.calls[0] as unknown[])[1]).toMatchObject({
			headers: { Authorization: 'Bearer TOK123' }
		});
	});
});

describe('mapPengajuanToTrip', () => {
	it('maps TRV row to Trip row', () => {
		const t = mapPengajuanToTrip({
			id_pengajuan: 1,
			nomor_pengajuan: 'TRV/202609/0001',
			tujuan: { nama_tujuan: 'Kantor Cabang Surabaya', kota: 'Surabaya' },
			tanggal_mulai: '2026-09-25',
			tanggal_selesai: '2026-09-28',
			maksud_tujuan: 'Dinas',
			estimasi_biaya: 3500000,
			uang_muka: 1000000,
			status: 'draft',
			proyek: { nama_proyek: 'Core Banking System' }
		});
		expect(t).toMatchObject({ id: 'TRV/202609/0001', kota: 'Surabaya', anggaran: 3500000 });
	});
});

describe('mapUserToSession', () => {
	it('maps user row to session', () => {
		const u = mapUserToSession({
			id: 2,
			name: 'Staff Astronova',
			email: 'staff@astronova.co.id',
			role: 'karyawan',
			jabatan: 'Software Engineer',
			nik: 'USR-001',
			departemen: 'Teknologi Informasi'
		});
		expect(u).toMatchObject({ nama: 'Staff Astronova', peran: 'karyawan', departemen: 'Teknologi Informasi' });
	});
});

describe('unwrap + mappers', () => {
	it('unwraps paginated {data:[]} and plain arrays', () => {
		expect(unwrap({ data: [{ a: 1 }], current_page: 1, last_page: 3 })).toEqual([{ a: 1 }]);
		expect(unwrap([{ a: 1 }])).toEqual([{ a: 1 }]);
	});

	it('maps RMB row to Reimbursement', () => {
		const r = mapPenggantianToReimb({
			id_penggantian: 1,
			nomor_penggantian: 'RMB/202609/0001',
			id_pengajuan: 3,
			total_pengeluaran: 4200000,
			status: 'draft',
			catatan: 'Klaim hotel',
			details: [{ id_kategori: 2, jumlah: 1700000, deskripsi: 'Hotel', kategori: { nama_kategori: 'Hotel' } }]
		});
		expect(r).toMatchObject({ id: 'RMB/202609/0001', jumlah: 4200000, kategori: 'Hotel' });
	});

	it('maps log row to AuditEntry', () => {
		const a = mapLogToAudit({
			id_log: 1,
			nama_user: 'Admin',
			model_type: 'pengajuan_perjalanan',
			model_id: 1,
			action: 'update',
			ip_address: '127.0.0.1',
			created_at: '2026-09-01T10:00:00.000000Z'
		});
		expect(a).toMatchObject({ id: 1, aktor: 'Admin' });
	});

	it('maps new module rows correctly', () => {
		const v = mapVendorToFE({ id_vendor: 1, nama_vendor: 'Garuda', kategori: 'Maskapai', rating: '4.7' });
		expect(v).toEqual({ id: 1, nama: 'Garuda', kategori: 'Maskapai', kontak: '', rating: 4.7 });

		const p = mapPolicyToFE({ id_policy: 1, latarbelakang: 'Dinas', grade: 'Staff', limit_biaya: 2500000, kelas: 'Ekonomi' });
		expect(p).toEqual({ id: 1, latarbelakang: 'Dinas', grade: 'Staff', limit: 2500000, kelas: 'Ekonomi' });

		const b = mapBookingToFE({ id_booking: 10, nomor_pengajuan: 'TRV/001', jenis: 'Hotel', harga: 500000, status: 'confirmed' });
		expect(b).toMatchObject({ id: '10', tripId: 'TRV/001', jenis: 'Hotel', harga: 500000, status: 'confirmed' });

		const um = mapUangMukaToFE({ id_uang_muka: 5, nomor_pengajuan: 'TRV/001', diajukan: 1000000, status: 'dicairkan' });
		expect(um).toMatchObject({ id: '5', tripId: 'TRV/001', diajukan: 1000000, status: 'dicairkan' });

		const s = mapSettlementToFE({ id_settlement: 3, nomor_pengajuan: 'TRV/001', total_realisasi: 950000, status: 'diverifikasi' });
		expect(s).toMatchObject({ id: '3', tripId: 'TRV/001', totalRealisasi: 950000, status: 'diverifikasi' });
	});
});
