import type { BookingStatus, FundStatus, TripStatus } from './types';

export type BadgeTone = 'ok' | 'pend' | 'sky' | 'bad' | 'neutral';

const TRIP_LABEL: Record<TripStatus, string> = {
	draft: 'Draft',
	menunggu_persetujuan: 'Menunggu Persetujuan',
	disetujui: 'Disetujui',
	berlangsung: 'Berlangsung',
	selesai: 'Selesai',
	ditolak: 'Ditolak'
};

export function tripTone(s: TripStatus): BadgeTone {
	switch (s) {
		case 'disetujui':
			return 'ok';
		case 'berlangsung':
			return 'sky';
		case 'menunggu_persetujuan':
		case 'draft':
			return 'pend';
		case 'ditolak':
			return 'bad';
		default:
			return 'neutral';
	}
}

export function tripLabel(s: TripStatus): string {
	return TRIP_LABEL[s];
}

export function bookingLabel(s: BookingStatus): string {
	switch (s) {
		case 'confirmed':
			return 'Confirmed';
		case 'pending':
			return 'Pending';
		default:
			return 'Dibatalkan';
	}
}

export function bookingTone(s: BookingStatus): BadgeTone {
	switch (s) {
		case 'confirmed':
			return 'ok';
		case 'pending':
			return 'pend';
		default:
			return 'bad';
	}
}

export function fundLabel(s: FundStatus): string {
	return s === 'dicairkan' ? 'Dicairkan' : 'Diajukan';
}

export function fundTone(s: FundStatus): BadgeTone {
	return s === 'dicairkan' ? 'ok' : 'pend';
}

export function genericTone(status: string): BadgeTone {
	const s = status.toLowerCase();
	if (
		s.includes('selesai') ||
		s.includes('cair') ||
		s.includes('verif') ||
		s.includes('bayar') ||
		s.includes('aktif') ||
		s.includes('ok')
	)
		return 'ok';
	if (s.includes('batal') || s.includes('tolak') || s.includes('over')) return 'bad';
	if (s.includes('jadwal') || s.includes('berjalan') || s.includes('konfirm')) return 'sky';
	if (s.includes('draft')) return 'neutral';
	return 'pend';
}
