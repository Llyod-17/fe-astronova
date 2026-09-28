import { describe, expect, it } from 'vitest';
import { angka, rupiahShort } from './format';

describe('angka', () => {
	it('renders counts without a currency prefix', () => {
		expect(angka(4)).toBe('4');
		expect(angka(0)).toBe('0');
	});

	it('uses the Indonesian thousands separator', () => {
		expect(angka(1500)).toBe('1.500');
		expect(angka(210)).toBe('210');
	});
});

describe('rupiahShort', () => {
	it('abbreviates large amounts with a locale-correct decimal', () => {
		expect(rupiahShort(5_000_000)).toBe('Rp5 Jt');
		expect(rupiahShort(1_500_000)).toBe('Rp1,5 Jt');
		expect(rupiahShort(2_000_000_000)).toBe('Rp2 M');
		expect(rupiahShort(150_000)).toBe('Rp150 Rb');
	});

	it('keeps a decimal in the Rb range instead of rounding to a whole unit', () => {
		expect(rupiahShort(1_400)).toBe('Rp1,4 Rb');
	});
});
