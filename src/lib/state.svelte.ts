import { toast } from 'svelte-sonner';
import { todayIso } from './format';
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
	user: userByRole('karyawan')
});

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

export function switchRole(r: Role) {
	session.role = r;
	session.user = userByRole(r);
}

export function currentUser(): User {
	return session.user;
}

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
	if (b) b.status = status;
}

export function addBooking(b: Omit<Booking, 'id'>): Booking {
	const nb = { id: `BK-2026-${String(bookings.length + 1).padStart(3, '0')}`, ...b };
	bookings.unshift(nb);
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
		toast.success(`Settlement ${id} diverifikasi`, { description: 'Siap masuk alur pembayaran.' });
	}
}

export function tuntaskanSettlement(id: string) {
	const s = settlements.find((x) => x.id === id);
	if (s) {
		s.status = 'selesai';
		toast.success(`Settlement ${id} selesai`, {
			description: 'Perjalanan dikunci dari perubahan lanjut.'
		});
	}
}

export function addVendor(v: Omit<Vendor, 'id'>) {
	vendors.push({ id: Math.max(0, ...vendors.map((x) => x.id)) + 1, ...v });
}

export function updatePolicy(id: number, patch: Partial<Policy>) {
	const p = policies.find((x) => x.id === id);
	if (p) Object.assign(p, patch);
}

export function markAllRead() {
	notifications.forEach((n) => (n.dibaca = true));
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
