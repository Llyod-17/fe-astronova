// Inti logika keuangan settlement: rekonsiliasi uang muka vs realisasi.
// ponytail: fungsi murni, dipakai finance + karyawan settlement.

export type Selisih = { selisih: number; jenis: 'lebih_bayar' | 'kurang_bayar' | 'impas' };

/** Jumlah reimbursement yang layak dibayar bila pengeluaran melebihi uang muka. */
export function hitungPenggantian(uangMuka: number, totalPengeluaran: number): number {
	return Math.max(0, totalPengeluaran - uangMuka);
}

/** Selisih uang muka terhadap realisasi. Positif = sisa uang muka yang harus dikembalikan karyawan. */
export function hitungSelisih(uangMuka: number, totalPengeluaran: number): Selisih {
	const selisih = uangMuka - totalPengeluaran;
	const jenis: Selisih['jenis'] =
		selisih > 0 ? 'lebih_bayar' : selisih < 0 ? 'kurang_bayar' : 'impas';
	return { selisih, jenis };
}

/** Nominal final yang harus dialirkan per jenis selisih. */
export function arahPembayaran(
	uangMuka: number,
	totalPengeluaran: number
): {
	label: string;
	nominal: number;
} {
	const { selisih, jenis } = hitungSelisih(uangMuka, totalPengeluaran);
	if (jenis === 'lebih_bayar') return { label: 'Penarikan sisa uang muka', nominal: selisih };
	if (jenis === 'kurang_bayar')
		return {
			label: 'Pelunasan reimbursement',
			nominal: hitungPenggantian(uangMuka, totalPengeluaran)
		};
	return { label: 'Impas — tidak ada pembayaran', nominal: 0 };
}
