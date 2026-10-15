import { toast } from 'svelte-sonner';
import { todayIso } from './format';
import { create, list, listAll, mapLogToAudit, mapPengajuanToTrip, mapPenggantianToReimb, mapUserToSession, approve, reject, patchStatus, uploadBukti, uploadDokumen, apiFetch, getToken, setToken, login as apiLogin, logout as apiLogout, me as apiMe } from './api';
import {
	BOOKINGS,
	DANA,
	DESTINASI,
	DEPARTMENTS,
	ITINERARY,
	KATEGORI,
	NOTIF,
	POLICIES,
	PROYEKS,
	REIMBURSEMENTS,
	SETTLEMENTS,
	TRIPS,
	VENDORS,
	userByRole
} from './data/mock';
import type {
	Booking,
	ItineraryItem,
	Notif,
	Policy,
	Role,
	Reimbursement,
	Settlement,
	Trip,
	UangMuka,
	User,
	Vendor
} from './types';

export const session = $state({
	role: 'karyawan' as Role,
	user: userByRole('karyawan'),
	authed: false
});

export const bootState = $state({ sessionReady: false });

export function currentUser(): User {
	return session.user;
}

// ponytail: token di localStorage = sumber auth; session.user diisi dari /me atau /login.
export async function bootstrapSession() {
	try {
		if (getToken()) {
			const u = await apiMe();
			const mapped = mapUserToSession(u);
			session.user = mapped;
			session.role = mapped.peran;
			session.authed = true;
		}
	} catch {
		setToken(null);
		session.authed = false;
	} finally {
		bootState.sessionReady = true;
	}
}

export async function doLogin(email: string, password: string): Promise<Role> {
	const d = await apiLogin(email, password);
	setToken(d.token);
	const mapped = mapUserToSession(d.user);
	session.user = mapped;
	session.role = mapped.peran;
	session.authed = true;
	toast.success(`Selamat datang, ${mapped.nama}`);
	return mapped.peran;
}

export async function doLogout() {
	try {
		await apiLogout();
	} catch {
		/* token mungkin udah mati */
	}
	setToken(null);
	session.authed = false;
	session.user = userByRole('karyawan');
	session.role = 'karyawan';
}

export const trips: Trip[] = $state([...TRIPS]);
export const bookings: Booking[] = $state([...BOOKINGS]);
export const itinerary: ItineraryItem[] = $state([...ITINERARY]);
export const dana: UangMuka[] = $state([...DANA]);
export const reimbursements: Reimbursement[] = $state([...REIMBURSEMENTS]);
export const settlements: Settlement[] = $state([...SETTLEMENTS]);
export const vendors: Vendor[] = $state([...VENDORS]);
export const policies: Policy[] = $state([...POLICIES]);
export const notifications: Notif[] = $state([...NOTIF]);
export const departments = $state([...DEPARTMENTS]);
export const kategori = $state([...KATEGORI]);
export const proyeks = $state([...PROYEKS]);
export const destinasi = $state([...DESTINASI]);

export function addTrip(t: Omit<Trip, 'id' | 'status' | 'level'>) {
	const n = trips.length + 1;
	trips.unshift({
		id: `TRIP-2026-${String(n).padStart(3, '0')}`,
		status: 'menunggu_persetujuan',
		level: 1,
		...t
	});
	return trips[0];
}

export function updateTripStatus(id: string, status: Trip['status']) {
	const t = trips.find((x) => x.id === id);
	if (t) t.status = status;
}

export function approveTrip(id: string, catatan?: string) {
	updateTripStatus(id, 'disetujui');
	toast.success(`TRIP ${id} disetujui`, {
		description: catatan || 'Pengajuan dilanjutkan ke booking.'
	});
}

export function rejectTrip(id: string, catatan: string) {
	updateTripStatus(id, 'ditolak');
	toast.error(`TRIP ${id} ditolak`, { description: catatan });
}

export function setBookingStatus(id: string, status: Booking['status']) {
	const b = bookings.find((x) => x.id === id);
	if (b) {
		b.status = status;
		import('./api').then((m) => m.updateBookingStatusBE(id, status)).catch(() => {});
	}
}

export function addBooking(b: Omit<Booking, 'id'>): Booking {
	const nb = { id: `BK-2026-${String(bookings.length + 1).padStart(3, '0')}`, ...b };
	bookings.unshift(nb);

	// ponytail: kirim ke BE jika pengajuan terdaftar
	const t = trips.find((x) => x.id === b.tripId);
	const rawId = (t as any)?._raw?.id_pengajuan;
	if (rawId) {
		import('./api').then(({ create, mapBookingToFE }) =>
			create('booking', {
				id_pengajuan: rawId,
				jenis: b.jenis,
				detail: b.detail,
				nomor_ref: b.nomorRef,
				vendor: b.vendor,
				harga: b.harga,
				status: b.status ?? 'pending'
			}).then((raw) => {
				// ganti placeholder dengan data BE
				const idx = bookings.findIndex((bk) => bk.id === nb.id);
				if (idx >= 0) {
					bookings[idx] = mapBookingToFE(raw);
				}
			})
		).catch(() => {});
	}

	return nb;
}

export function reorderItinerary(tripId: string, items: ItineraryItem[]) {
	const others = itinerary.filter((i) => i.tripId !== tripId);
	const mine = items.map((x) => ({ ...x, id: x.id }));
	itinerary.length = 0;
	itinerary.push(...others, ...mine);
}

export function ajukanUangMuka(tripId: string, jumlah: number) {
	dana.unshift({
		id: `UM-${String(dana.length + 1).padStart(3, '0')}`,
		tripId,
		diajukan: jumlah,
		disetujui: 0,
		status: 'diajukan',
		tanggal: todayIso()
	});
	toast.success('Uang muka diajukan', { description: 'Menunggu persetujuan atasan & finance.' });
}

export function ajukanReimbursement(r: Omit<Reimbursement, 'id' | 'status'>) {
	reimbursements.unshift({
		id: `RB-${String(reimbursements.length + 1).padStart(3, '0')}`,
		status: 'diajukan',
		...r
	});
	toast.success('Reimbursement diajukan', {
		description: 'Diteruskan ke finance untuk verifikasi.'
	});
}

export function submitSettlement(tripId: string) {
	const total = reimbursements.filter((r) => r.tripId === tripId).reduce((a, r) => a + r.jumlah, 0);
	settlements.unshift({
		id: `STL-${String(settlements.length + 1).padStart(3, '0')}`,
		tripId,
		status: 'diajukan',
		totalRealisasi: total
	});
	toast.success('Settlement diajukan', {
		description: 'Direkonsiliasi dengan uang muka oleh finance.'
	});
}

export function realisasiTrip(tripId: string): number {
	return reimbursements.filter((r) => r.tripId === tripId).reduce((a, r) => a + r.jumlah, 0);
}

export function uangMukaTrip(tripId: string): number {
	return dana
		.filter((d) => d.tripId === tripId && d.status === 'dicairkan')
		.reduce((a, d) => a + d.disetujui, 0);
}

export function cairkanDana(id: string) {
	const d = dana.find((x) => x.id === id);
	if (d) {
		d.status = 'dicairkan';
		d.disetujui = d.diajukan;
		import('./api').then((m) => m.cairkanUangMukaBE(id)).catch(() => {});
		toast.success(`Dana ${id} dicairkan`, {
			description: 'Notifikasi terkirim ke karyawan & atasan.'
		});
	}
}

export function verifikasiReimbursement(id: string, setujui: boolean) {
	const r = reimbursements.find((x) => x.id === id);
	if (!r) return;
	r.status = setujui ? 'siap_bayar' : 'diverifikasi';
	toast[setujui ? 'success' : 'info'](
		`${setujui ? 'Reimbursement' : 'Reimbursement'} ${id} ${setujui ? 'siap dibayar' : 'diminta revisi'}`
	);
}

export function bayarReimbursement(id: string) {
	const r = reimbursements.find((x) => x.id === id);
	if (r) {
		r.status = 'selesai';
		toast.success(`Pembayaran ${id} selesai`);
	}
}

export function verifikasiSettlement(id: string) {
	const s = settlements.find((x) => x.id === id);
	if (s) {
		s.status = 'diverifikasi';
		import('./api').then((m) => m.updateSettlementStatusBE(id, 'diverifikasi')).catch(() => {});
		toast.success(`Settlement ${id} diverifikasi`, { description: 'Siap masuk alur pembayaran.' });
	}
}

export function tuntaskanSettlement(id: string) {
	const s = settlements.find((x) => x.id === id);
	if (s) {
		s.status = 'selesai';
		import('./api').then((m) => m.updateSettlementStatusBE(id, 'selesai')).catch(() => {});
		toast.success(`Settlement ${id} selesai`, {
			description: 'Perjalanan dikunci dari perubahan lanjut.'
		});
	}
}

export function addVendor(v: Omit<Vendor, 'id'>) {
	const nv = { id: Math.max(0, ...vendors.map((x) => x.id)) + 1, ...v };
	vendors.push(nv);
	import('./api').then(({ create, mapVendorToFE }) =>
		create('vendor', { nama_vendor: v.nama, kategori: v.kategori, kontak: v.kontak, rating: v.rating }).then(
			(raw) => {
				const idx = vendors.indexOf(nv);
				if (idx >= 0) vendors[idx] = mapVendorToFE(raw);
			}
		)
	).catch(() => {});
}

export function updatePolicy(id: number, patch: Partial<Policy>) {
	const p = policies.find((x) => x.id === id);
	if (p) {
		Object.assign(p, patch);
		import('./api').then(({ update }) =>
			update('travel-policy', id, {
				latarbelakang: p.latarbelakang,
				grade: p.grade,
				limit_biaya: p.limit,
				kelas: p.kelas
			})
		).catch(() => {});
	}
}

export function markAllRead() {
	notifications.forEach((n) => (n.dibaca = true));
	import('./api').then((m) => m.markAllNotifReadBE()).catch(() => {});
}

export function unreadCount(): number {
	return notifications.filter((n) => !n.dibaca).length;
}

export function tripById(id: string): Trip | undefined {
	return trips.find((t) => t.id === id);
}

export function namaByKaryawan(id: number): string {
	return userByRole('karyawan').id === id ? userByRole('karyawan').nama : `Karyawan #${id}`;
}

// BE live loaders — mock tetap fallback bila BE mati. ponytail: no store baru, timpa $state lama.
export const be = $state({ live: false, err: '' });
let booted = false;

export async function loadMasters() {
	try {
		const [dep, kat, pro, tuj] = await Promise.all([
			list('departemen'),
			list('kategori-pengeluaran'),
			list('proyek'),
			list('tujuan')
		]);
		departments.length = 0;
		departments.push(
			...dep.map((d: any) => ({ id: d.id_departemen, nama: d.nama_departemen, count: 0 }))
		);
		kategori.length = 0;
		kategori.push(
			...kat.map((k: any) => ({ id: k.id_kategori, nama: k.nama_kategori, deskripsi: k.deskripsi ?? '—' }))
		);
		proyeks.length = 0;
		proyeks.push(...pro.map((p: any) => ({ id: p.id_proyek, nama: p.nama_proyek, kode: p.kode_proyek })));
		destinasi.length = 0;
		destinasi.push(
			...tuj.map((t: any) => ({ id: t.id_tujuan, nama: t.nama_tujuan, kota: t.kota, negara: t.negara }))
		);
		be.live = true;
		be.err = '';
	} catch (e: unknown) {
		be.live = false;
		be.err = (e as { message?: string })?.message ?? 'BE mati';
	}
}

export async function loadTrips() {
	try {
		const rows = await listAll('pengajuan-perjalanan');
		trips.length = 0;
		trips.push(...(rows.map(mapPengajuanToTrip) as Trip[]));
		be.live = true;
	} catch (e: unknown) {
		be.live = false;
		be.err = (e as { message?: string })?.message ?? 'BE mati';
	}
}

export async function loadReimbursements() {
	try {
		const rows = await listAll('pengajuan-penggantian');
		reimbursements.length = 0;
		reimbursements.push(...(rows.map(mapPenggantianToReimb) as Reimbursement[]));
		be.live = true;
	} catch (e: unknown) {
		be.live = false;
		be.err = (e as { message?: string })?.message ?? 'BE mati';
	}
}

export const auditLive = $state<{ rows: any[] }>({ rows: [] });
export async function loadAuditLive() {
	try {
		const rows = await listAll('log-audit?per_page=50', true);
		auditLive.rows = rows.map(mapLogToAudit);
		be.live = true;
	} catch (e: unknown) {
		be.live = false;
		be.err = (e as any)?.message ?? (e as any)?.errors ? JSON.stringify((e as any).errors) : 'butuh token';
	}
}

export async function loadVendors() {
	try {
		const { mapVendorToFE } = await import('./api');
		const rows = await listAll('vendor', true);
		vendors.length = 0;
		vendors.push(...rows.map(mapVendorToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export async function loadPolicies() {
	try {
		const { mapPolicyToFE } = await import('./api');
		const rows = await listAll('travel-policy', true);
		policies.length = 0;
		policies.push(...rows.map(mapPolicyToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export async function loadNotif() {
	try {
		const { mapNotifToFE } = await import('./api');
		const rows = await listAll('notifikasi', true);
		notifications.length = 0;
		notifications.push(...rows.map(mapNotifToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export async function loadBookings() {
	try {
		const { mapBookingToFE } = await import('./api');
		const rows = await listAll('booking', true);
		bookings.length = 0;
		bookings.push(...rows.map(mapBookingToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export async function loadItinerary() {
	try {
		const { mapItineraryToFE } = await import('./api');
		const rows = await listAll('itinerary', true);
		itinerary.length = 0;
		itinerary.push(...rows.map(mapItineraryToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export async function loadDana() {
	try {
		const { mapUangMukaToFE } = await import('./api');
		const rows = await listAll('uang-muka', true);
		dana.length = 0;
		dana.push(...rows.map(mapUangMukaToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export async function loadSettlements() {
	try {
		const { mapSettlementToFE } = await import('./api');
		const rows = await listAll('settlement', true);
		settlements.length = 0;
		settlements.push(...rows.map(mapSettlementToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export const penggunaList = $state<any[]>([]);
export async function loadPengguna() {
	try {
		const { mapPenggunaToFE } = await import('./api');
		const rows = await listAll('pengguna', true);
		penggunaList.length = 0;
		penggunaList.push(...rows.map(mapPenggunaToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

export const delegasiList = $state<any[]>([]);
export async function loadDelegasi() {
	try {
		const { mapDelegasiToFE } = await import('./api');
		const rows = await listAll('delegasi', true);
		delegasiList.length = 0;
		delegasiList.push(...rows.map(mapDelegasiToFE));
		be.live = true;
	} catch {
		be.live = false;
	}
}

// sekali per sesi — layout panggil ini; tiap halaman cukup baca $state.
export async function bootBe() {
	if (booted) return;
	booted = true;
	await bootstrapSession();
	await Promise.all([
		loadMasters(),
		loadTrips(),
		loadReimbursements(),
		loadVendors(),
		loadPolicies(),
		loadNotif(),
		loadBookings(),
		loadItinerary(),
		loadDana(),
		loadSettlements(),
		loadPengguna(),
		loadDelegasi()
	]);
}

function idTujuanOf(nama: string, kota: string) {
	return destinasi.find((d) => d.nama === nama || d.kota === kota)?.id ?? destinasi[0]?.id ?? 1;
}
function idProyekOf(nama: string) {
	return proyeks.find((p) => p.nama === nama)?.id ?? proyeks[0]?.id ?? 1;
}
function idKategoriOf(nama: string) {
	return kategori.find((k) => k.nama === nama)?.id ?? kategori[0]?.id ?? 1;
}

// tulis: pengajuan (BE-first, fallback lokal)
export async function kirimPengajuanBE(f: {
	tujuan: string;
	kota: string;
	berangkat: string;
	kembali: string;
	keperluan: string;
	anggaran: number;
	uangMuka: number;
	proyek: string;
}) {
	const body = {
		// ponytail: tabel users & karyawan belum digabung; id_karyawan tetap 1 sampai normalisasi.
		id_karyawan: 1,
		id_proyek: idProyekOf(f.proyek),
		id_tujuan: idTujuanOf(f.tujuan, f.kota),
		tanggal_mulai: f.berangkat,
		tanggal_selesai: f.kembali,
		maksud_tujuan: f.keperluan,
		uang_muka: f.uangMuka,
		catatan: f.tujuan,
		details: [{ id_kategori: idKategoriOf('Transportasi'), estimasi_biaya: f.anggaran, keterangan: f.keperluan }]
	};
	const saved = await create('pengajuan-perjalanan', body);
	await loadTrips();
	return saved;
}

// tulis: approval via BE auth, fallback lokal bila 401/BE mati
export async function setujuBE(tripId: string, catatan?: string) {
	const raw = (trips.find((t) => t.id === tripId) as any)?._raw;
	const nid = raw?.id_pengajuan;
	try {
		if (nid == null) throw new Error('no-id');
		if (catatan || true) await patchStatus('pengajuan-perjalanan', nid, 'menunggu_persetujuan', catatan).catch(() => {});
		await approve('pengajuan_perjalanan', nid, { catatan });
		await loadTrips();
		toast.success(`TRIP ${tripId} disetujui`);
	} catch {
		approveTrip(tripId, catatan);
	}
}
export async function tolakBE(tripId: string, catatan: string) {
	const raw = (trips.find((t) => t.id === tripId) as any)?._raw;
	const nid = raw?.id_pengajuan;
	try {
		if (nid == null) throw new Error('no-id');
		await reject('pengajuan_perjalanan', nid, { catatan });
		await loadTrips();
		toast.error(`TRIP ${tripId} ditolak`, { description: catatan });
	} catch {
		rejectTrip(tripId, catatan);
	}
}

// tulis: reimbursement -> penggantian BE (cari id_pengajuan dari nomor trip)
export async function ajukanGantiBE(r: { tripId: string; kategori: string; deskripsi: string; jumlah: number; bukti?: string }) {
	const raw = (trips.find((t) => t.id === r.tripId) as any)?._raw;
	const nid = raw?.id_pengajuan;
	const body = {
		id_pengajuan: nid ?? 3,
		tanggal_pengajuan: todayIso(),
		catatan: r.deskripsi,
		details: [
			{
				id_kategori: idKategoriOf(r.kategori),
				tanggal_pengeluaran: todayIso(),
				deskripsi: r.deskripsi,
				jumlah: r.jumlah,
				...(r.bukti ? { bukti_file: r.bukti } : {})
			}
		]
	};
	try {
		await create('pengajuan-penggantian', body);
		await loadReimbursements();
		toast.success('Reimbursement diajukan');
	} catch {
		ajukanReimbursement({ tripId: r.tripId, kategori: r.kategori, deskripsi: r.deskripsi, jumlah: r.jumlah, bukti: r.bukti ?? '' });
	}
}

export async function uploadBuktiBE(file: File, idPengeluaran: number) {
	const fd = new FormData();
	fd.append('file', file);
	fd.append('id_pengeluaran', String(idPengeluaran));
	return uploadBukti(fd);
}
export async function uploadDokumenBE(file: File, idPengajuan: number, jenis = 'lainnya') {
	const fd = new FormData();
	fd.append('file', file);
	fd.append('id_pengajuan', String(idPengajuan));
	fd.append('jenis_dokumen', jenis);
	return uploadDokumen(fd);
}
export const historyBE = (tripId: string) => {
	const raw = (trips.find((t) => t.id === tripId) as any)?._raw;
	return raw?.id_pengajuan != null
		? import('./api').then((m) => m.history('pengajuan_perjalanan', raw.id_pengajuan))
		: Promise.resolve([]);
};

export async function tambahMaster(
	kind: 'departemen' | 'kategori' | 'proyek' | 'destinasi',
	nama: string
) {
	const body =
		kind === 'departemen'
			? { nama_departemen: nama }
			: kind === 'kategori'
				? { nama_kategori: nama }
				: kind === 'proyek'
					? { nama_proyek: nama, kode_proyek: `PROJ-${Date.now().toString(36).toUpperCase()}` }
					: { nama_tujuan: nama, kota: nama, negara: 'Indonesia' };
	const route =
		kind === 'departemen'
			? 'departemen'
			: kind === 'kategori'
				? 'kategori-pengeluaran'
				: kind === 'proyek'
					? 'proyek'
					: 'tujuan';
	try {
		await create(route, body);
		await loadMasters();
	} catch {
		// fallback lokal bila BE mati — jangan blokir UI
		if (kind === 'departemen')
			departments.push({ id: Math.max(0, ...departments.map((d) => d.id)) + 1, nama, count: 0 });
	}
}
