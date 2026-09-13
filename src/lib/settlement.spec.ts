import { describe, expect, it } from 'vitest';
import { arahPembayaran, hitungPenggantian, hitungSelisih } from './settlement';

describe('settlement keuangan', () => {
	it('pengeluaran melebihi uang muka -> kurang bayar, diganti selisihnya', () => {
		expect(hitungSelisih(2_000_000, 2_750_000)).toEqual({
			selisih: -750_000,
			jenis: 'kurang_bayar'
		});
		expect(hitungPenggantian(2_000_000, 2_750_000)).toBe(750_000);
		expect(arahPembayaran(2_000_000, 2_750_000)).toEqual({
			label: 'Pelunasan reimbursement',
			nominal: 750_000
		});
	});

	it('realisasi di bawah uang muka -> lebih bayar, sisa ditarik', () => {
		expect(hitungSelisih(3_000_000, 2_400_000)).toEqual({ selisih: 600_000, jenis: 'lebih_bayar' });
		expect(arahPembayaran(3_000_000, 2_400_000)).toEqual({
			label: 'Penarikan sisa uang muka',
			nominal: 600_000
		});
	});

	it('impas saat uang muka sama dengan realisasi', () => {
		expect(hitungSelisih(1_500_000, 1_500_000)).toEqual({ selisih: 0, jenis: 'impas' });
		expect(arahPembayaran(1_500_000, 1_500_000).nominal).toBe(0);
	});

	it('realisasi tanpa uang muka -> seluruh pengeluaran diganti', () => {
		expect(hitungPenggantian(0, 850_000)).toBe(850_000);
	});
});
