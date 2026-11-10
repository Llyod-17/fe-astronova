// src/lib/api.ts — single BE client per api.md. ponytail: fetch stdlib, no deps.
import type {
	Booking,
	Delegasi,
	FundStatus,
	ItineraryItem,
	Notif,
	Policy,
	Role,
	Settlement,
	UangMuka,
	User,
	Vendor
} from './types';

export const BASE = '/api';

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
	return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token: string | null): void {
	if (typeof localStorage === 'undefined') return;
	if (token) localStorage.setItem(TOKEN_KEY, token);
	else localStorage.removeItem(TOKEN_KEY);
}

type Opts = { method?: string; body?: unknown; headers?: Record<string, string>; auth?: boolean };

export async function apiFetch(path: string, { method = 'GET', body, headers = {}, auth = false }: Opts = {}) {
	const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
	const token = getToken();
	const res = await fetch(BASE + path, {
		method,
		headers: {
			Accept: 'application/json',
			...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
			...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
			...headers
		},
		body: body ? (isForm ? (body as BodyInit) : JSON.stringify(body)) : undefined
	});
	const json = await res.json().catch(() => ({}));
	if (!json.success) throw { status: res.status, ...json };
	return json as { success: boolean; message: string; data: any };
}

// ponytail: mapper tipis BE->FE, bentuk asli tetap di tangan pemakai bila perlu.
export function mapUserToSession(u: Record<string, any>): User {
	return {
		id: u.id as number,
		nama: (u.name as string) ?? '',
		nik: (u.nik as string) ?? '',
		jabatan: (u.jabatan as string) ?? '',
		departemen: (u.departemen as string) ?? '',
		email: (u.email as string) ?? '',
		peran: (u.role as Role) ?? 'karyawan',
		id_karyawan: (u.id_karyawan as number | null) ?? null
	} as User & { id_karyawan: number | null };
}

export type LoginResult = { user: Record<string, any>; token: string; };

export const login = (email: string, password: string): Promise<LoginResult> =>
	apiFetch('/login', { method: 'POST', body: { email, password } }).then((x) => x.data as LoginResult);

export const logout = () => apiFetch('/logout', { method: 'POST' }).then((x) => x.data);

export const me = () => apiFetch('/me').then((x) => x.data as Record<string, any>);

export function mapPengajuanToTrip(p: Record<string, any>) {
	return {
		id: (p.nomor_pengajuan as string) ?? String(p.id_pengajuan),
		karyawanId: (p.id_karyawan as number) ?? 0,
		karyawanNama: ((p.karyawan as any)?.nama_lengkap ?? '') as string,
		karyawanNik: ((p.karyawan as any)?.nik ?? '') as string,
		tujuan: ((p.tujuan as Record<string, string> | undefined)?.nama_tujuan ?? p.tujuan ?? '') as string,
		kota: ((p.tujuan as Record<string, string> | undefined)?.kota ?? '') as string,
		berangkat: p.tanggal_mulai as string,
		kembali: p.tanggal_selesai as string,
		keperluan: p.maksud_tujuan as string,
		anggaran: Number(p.estimasi_biaya ?? 0),
		uangMuka: Number(p.uang_muka ?? 0),
		status: p.status as string,
		level: 1,
		proyek: ((p.proyek as Record<string, string> | undefined)?.nama_proyek ?? '') as string,
		_raw: p
	};
}

export function mapPenggantianToReimb(g: Record<string, any>) {
	const d0 = (g.details as any[])?.[0] ?? {};
	return {
		id: (g.nomor_penggantian as string) ?? String(g.id_penggantian),
		tripId: (g.pengajuan_perjalanan as any)?.nomor_pengajuan ?? String(g.id_pengajuan ?? ''),
		kategori: (d0.kategori as any)?.nama_kategori ?? d0.deskripsi ?? '',
		deskripsi: (g.catatan as string) ?? (d0.deskripsi as string) ?? '',
		jumlah: Number(g.total_pengeluaran ?? d0.jumlah ?? 0),
		status: mapGantiStatus(g.status as string),
		bukti: (d0.bukti_file as string) ?? '',
		_raw: g
	};
}
function mapGantiStatus(s: string) {
	return s === 'disetujui' || s === 'selesai'
		? 'selesai'
		: s === 'ditolak'
			? 'ditolak'
			: s === 'diverifikasi'
				? 'diverifikasi'
				: 'diajukan';
}

export function mapVendorToFE(v: Record<string, any>): Vendor {
	return {
		id: v.id_vendor as number,
		nama: (v.nama_vendor as string) ?? (v.nama as string) ?? '',
		kategori: (v.kategori as string) ?? '',
		kontak: (v.kontak as string) ?? '',
		rating: Number(v.rating ?? 0)
	};
}

export function mapPolicyToFE(p: Record<string, any>): Policy {
	return {
		id: p.id_policy as number,
		latarbelakang: (p.latarbelakang as string) ?? '',
		grade: (p.grade as string) ?? '',
		limit: Number(p.limit_biaya ?? 0),
		kelas: (p.kelas as string) ?? ''
	};
}

export function mapNotifToFE(n: Record<string, any>): Notif {
	return {
		id: n.id_notifikasi as number,
		judul: (n.judul as string) ?? '',
		isidata: (n.isi as string) ?? (n.isidata as string) ?? '',
		waktu: (n.waktu as string) ?? '',
		dibaca: Boolean(n.dibaca)
	};
}

export function mapDelegasiToFE(d: Record<string, any>): Delegasi {
	return {
		id: d.id_delegasi as number,
		dari: (d.pemberi as string) ?? 'Atasan',
		kepada: (d.penerima as string) ?? '',
		dari_tgl: (d.dari_tgl as string) ?? '',
		sampai_tgl: (d.sampai_tgl as string) ?? '',
		alasan: (d.alasan as string) ?? '',
		aktif: Boolean(d.aktif ?? true),
		id_pemberi: d.id_pemberi as number | undefined,
		id_penerima: d.id_penerima as number | undefined
	} as Delegasi & { id_pemberi?: number; id_penerima?: number };
}

export function mapItineraryToFE(it: Record<string, any>): ItineraryItem {
	return {
		id: String(it.id_itinerary ?? it.id),
		tripId: (it.nomor_pengajuan as string) ?? String(it.id_pengajuan ?? it.tripId ?? ''),
		waktu: (it.waktu as string) ?? '',
		aktivitas: (it.aktivitas as string) ?? '',
		lokasi: (it.lokasi as string) ?? ''
	};
}

export function mapBookingToFE(b: Record<string, any>): Booking {
	return {
		id: String(b.id_booking ?? b.id),
		tripId: (b.nomor_pengajuan as string) ?? String(b.id_pengajuan ?? b.tripId ?? ''),
		jenis: b.jenis as Booking['jenis'],
		detail: (b.detail as string) ?? '',
		nomorRef: (b.nomor_ref as string) ?? (b.nomorRef as string) ?? '',
		vendor: (b.vendor as string) ?? '',
		harga: Number(b.harga ?? 0),
		status: (b.status as Booking['status']) ?? 'pending'
	};
}

export function mapUangMukaToFE(um: Record<string, any>): UangMuka {
	return {
		id: String(um.id_uang_muka ?? um.id),
		tripId: (um.nomor_pengajuan as string) ?? String(um.id_pengajuan ?? um.tripId ?? ''),
		diajukan: Number(um.diajukan ?? 0),
		disetujui: Number(um.disetujui ?? 0),
		status: (um.status as FundStatus) ?? 'diajukan',
		tanggal: (um.tanggal as string) ?? '',
		_raw: um
	};
}

export function mapSettlementToFE(s: Record<string, any>): Settlement {
	return {
		id: String(s.id_settlement ?? s.id),
		tripId: (s.nomor_pengajuan as string) ?? String(s.id_pengajuan ?? s.tripId ?? ''),
		status: (s.status as Settlement['status']) ?? 'diajukan',
		totalRealisasi: Number(s.total_realisasi ?? 0),
		_raw: s
	};
}

export function mapPenggunaToFE(u: Record<string, any>) {
	return {
		id: u.id as number,
		nama: u.name as string,
		nik: u.nik as string,
		jabatan: u.jabatan as string,
		departemen: u.departemen as string,
		email: u.email as string,
		peran: u.role as string
	};
}

export const cairkanUangMukaBE = (id: string | number) =>
	apiFetch(`/uang-muka/${id}/cairkan`, { method: 'POST', auth: true }).then((x) => x.data);

export const updateBookingStatusBE = (id: string | number, status: string) =>
	patchStatus('booking', id, status);

export const updateSettlementStatusBE = (id: string | number, status: string) =>
	patchStatus('settlement', id, status);

export const markAllNotifReadBE = () =>
	apiFetch('/notifikasi/read-all', { method: 'PATCH', auth: true }).then((x) => x.data);

export function mapLogToAudit(l: Record<string, any>) {
	return {
		id: l.id_log as number,
		waktu: (l.created_at as string) ?? new Date().toISOString(),
		aktor: (l.nama_user as string) ?? '—',
		aksi: `${(l.model_type as string) ?? ''}:${(l.action as string) ?? ''}`,
		entitas: `${(l.model_type as string) ?? ''}#${(l.model_id as number) ?? ''}`,
		ip: (l.ip_address as string) ?? '—',
		_raw: l
	};
}

// CRUD generik: list/create/show/update/remove + status/upload/auth khusus.
// ponytail: BE campur array langsung vs paginasi {data:[]}; unwrap sekali di sini.
export const unwrap = (d: any): any[] =>
	Array.isArray(d) ? d : (d as { data?: any })?.data ?? d;
export const list = (r: string, auth = false): Promise<any[]> =>
	apiFetch(`/${r}`, { auth }).then((x) => unwrap(x.data));
// ponytail: ambil semua page (BE paginasi transaksi); master array langsung sekali jalan.
export async function listAll(r: string, auth = false): Promise<any[]> {
	const first = await apiFetch(`/${r}`, { auth });
	if (Array.isArray(first.data)) return first.data;
	const pg = first.data as { data?: any[]; current_page?: number; last_page?: number };
	if (!pg?.data || !pg.last_page || pg.last_page <= 1) return unwrap(first.data);
	const out = [...(pg.data ?? [])];
	for (let p = 2; p <= (pg.last_page ?? 1); p++) {
		const j = await apiFetch(`/${r}?page=${p}`, { auth });
		out.push(...unwrap(j.data));
	}
	return out;
}
export const show = (r: string, id: string | number, auth = false) =>
	apiFetch(`/${r}/${id}`, { auth }).then((x) => x.data);
export const create = (r: string, body: unknown) =>
	apiFetch(`/${r}`, { method: 'POST', body }).then((x) => x.data);
export const update = (r: string, id: string | number, body: unknown) =>
	apiFetch(`/${r}/${id}`, { method: 'PUT', body }).then((x) => x.data);
export const remove = (r: string, id: string | number) =>
	apiFetch(`/${r}/${id}`, { method: 'DELETE' }).then((x) => x.data);
export const patchStatus = (r: string, id: string | number, status: string, catatan?: string) =>
	apiFetch(`/${r}/${id}/status`, { method: 'PATCH', body: { status, catatan } }).then((x) => x.data);
export const approve = (type: string, id: number, b: Record<string, unknown>) =>
	apiFetch('/persetujuan/approve', {
		method: 'POST',
		auth: true,
		body: { approvable_type: type, approvable_id: id, ...b }
	}).then((x) => x.data);
export const reject = (type: string, id: number, b: Record<string, unknown>) =>
	apiFetch('/persetujuan/reject', {
		method: 'POST',
		auth: true,
		body: { approvable_type: type, approvable_id: id, ...b }
	}).then((x) => x.data);
export const history = (type: string, id: number) =>
	apiFetch(`/persetujuan/${type}/${id}/history`, { auth: true }).then((x) => x.data);
export const uploadBukti = (fd: FormData) =>
	apiFetch('/bukti-struk', { method: 'POST', auth: true, body: fd }).then((x) => x.data);
export const uploadDokumen = (fd: FormData) =>
	apiFetch('/dokumen-pendukung', { method: 'POST', auth: true, body: fd }).then((x) => x.data);
