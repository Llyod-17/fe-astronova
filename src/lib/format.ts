const idr = new Intl.NumberFormat('id-ID', {
	style: 'currency',
	currency: 'IDR',
	maximumFractionDigits: 0
});

const num = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** Locale-aware single decimal. Also drops the trailing zero, so 5 stays "5" not "5,0". */
const dec1 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });

/** Counts, quantities, anything that is not money. Indonesian thousands separator. */
export function angka(n: number): string {
	return num.format(n);
}

export function rupiah(n: number): string {
	return idr.format(n);
}

export function rupiahShort(n: number): string {
	if (n >= 1_000_000_000) return `Rp${dec1.format(n / 1_000_000_000)} M`;
	if (n >= 1_000_000) return `Rp${dec1.format(n / 1_000_000)} Jt`;
	if (n >= 1_000) return `Rp${dec1.format(n / 1_000)} Rb`;
	return `Rp${n}`;
}

export function dateId(iso: string): string {
	return new Date(iso).toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

export function dateTimeId(iso: string): string {
	return (
		dateId(iso) +
		' ' +
		new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
	);
}

export function daysBetween(a: string, b: string): number {
	return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000) + 1);
}

export function todayIso(): string {
	return new Date().toISOString().slice(0, 10);
}

export function initials(nama: string): string {
	return nama
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join('')
		.toUpperCase();
}
