<script lang="ts">
	import '$lib/chart';
	import { Bar, Doughnut } from 'svelte-chartjs';
	import { reimbursements, trips } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { tripLabel } from '$lib/status';
	import { FileDown } from 'lucide-svelte';

	let { title = 'Laporan' }: { title?: string } = $props();

	const NAVY = '#2f4156';
	const TEAL = '#567c8d';
	const TEAL_L = '#7196a5';
	const SKY = '#c8d9e6';

	const bulanTeks = $derived([
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'Mei',
		'Jun',
		'Jul',
		'Agu',
		'Sep',
		'Okt',
		'Nov',
		'Des'
	]);

	const monthly = $derived.by(() => {
		const acc = Array(12).fill(0);
		for (const t of trips) {
			const m = new Date(t.berangkat).getMonth();
			acc[m] += t.anggaran;
		}
		return acc;
	});

	const kategoriTotal = $derived.by(() => {
		const acc: Record<string, number> = {};
		for (const r of reimbursements) acc[r.kategori] = (acc[r.kategori] ?? 0) + r.jumlah;
		return Object.entries(acc).sort((a, b) => b[1] - a[1]);
	});

	const totalAnggaran = $derived(trips.reduce((s, t) => s + t.anggaran, 0));
	const totalRealisasi = $derived(reimbursements.reduce((s, r) => s + r.jumlah, 0));

	const barData = $derived({
		labels: bulanTeks,
		datasets: [
			{
				label: 'Anggaran (Rp)',
				data: monthly,
				backgroundColor: SKY,
				hoverBackgroundColor: TEAL_L,
				borderRadius: 8,
				borderSkipped: false
			}
		]
	});

	const doughnutData = $derived({
		labels: kategoriTotal.map(([k]) => k),
		datasets: [
			{
				data: kategoriTotal.map(([, v]) => v),
				backgroundColor: [NAVY, TEAL, TEAL_L, SKY, '#e8825c'],
				borderWidth: 2,
				borderColor: '#ffffff'
			}
		]
	});

	const barOptions = $derived({
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			y: {
				grid: { color: 'rgba(47,65,86,0.08)' },
				ticks: { color: '#71808c', font: { size: 11 } }
			},
			x: { grid: { display: false }, ticks: { color: '#71808c', font: { size: 11 } } }
		}
	});

	const doughnutOptions = $derived({
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'bottom' as const, labels: { color: '#44474c', font: { size: 11 } } }
		}
	});

	function exportExcel() {
		const rows = trips.map((t) => ({
			'No. Pengajuan': t.id,
			Tujuan: t.tujuan,
			Berangkat: t.berangkat,
			Kembali: t.kembali,
			Anggaran: t.anggaran,
			Status: tripLabel(t.status)
		}));
		// dynamic import membatasi beban bundle halaman laporan
		import('xlsx').then((XLSX) => {
			const ws = XLSX.utils.json_to_sheet(rows);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'Perjalanan Dinas');
			XLSX.writeFile(wb, 'laporan-perjalanan-dinas.xlsx');
		});
	}

	function exportPdf() {
		import('jspdf').then(async ({ default: jsPDF }) => {
			const { default: autoTable } = await import('jspdf-autotable');
			const doc = new jsPDF();
			doc.setFontSize(16);
			doc.text(title, 14, 18);
			doc.setFontSize(10);
			doc.setTextColor(113, 128, 140);
			doc.text(`Dihasilkan ${dateId(new Date().toISOString())}`, 14, 25);
			doc.setTextColor(30, 41, 55);
			autoTable(doc, {
				startY: 32,
				head: [['No', 'Tujuan', 'Berangkat', 'Kembali', 'Anggaran', 'Status']],
				body: trips.map((t, i) => [
					String(i + 1),
					t.tujuan,
					t.berangkat,
					t.kembali,
					rupiah(t.anggaran),
					tripLabel(t.status)
				]),
				styles: { fontSize: 8, cellPadding: 3 },
				headStyles: { fillColor: [47, 65, 86] }
			});
			doc.save('laporan-perjalanan-dinas.pdf');
		});
	}
</script>

<div class="grid gap-5">
	<div class="grid gap-4 sm:grid-cols-3">
		<Card padding="stat" class="rounded-[20px]">
			<p class="text-[12px] font-medium text-muted-subtle">Total Anggaran</p>
			<p class="mt-1 font-heading text-[22px] font-medium text-navy-deep">
				{rupiah(totalAnggaran)}
			</p>
		</Card>
		<Card padding="stat" class="rounded-[20px]">
			<p class="text-[12px] font-medium text-muted-subtle">Realisasi Klaim</p>
			<p class="mt-1 font-heading text-[22px] font-medium text-navy-deep">
				{rupiah(totalRealisasi)}
			</p>
		</Card>
		<Card padding="stat" class="rounded-[20px]">
			<p class="text-[12px] font-medium text-muted-subtle">Perjalanan Dinas</p>
			<p class="mt-1 font-heading text-[22px] font-medium text-navy-deep">
				{trips.length} pengajuan
			</p>
		</Card>
	</div>

	<div class="grid gap-5 xl:grid-cols-2">
		<Card>
			<p class="mb-4 text-[12px] font-semibold tracking-[0.06em] text-muted-subtle uppercase">
				Anggaran per Bulan
			</p>
			<div class="h-[260px]">
				<Bar data={barData} options={barOptions} />
			</div>
		</Card>
		<Card>
			<p class="mb-4 text-[12px] font-semibold tracking-[0.06em] text-muted-subtle uppercase">
				Distribusi Kategori Biaya
			</p>
			<div class="h-[260px]">
				<Doughnut data={doughnutData} options={doughnutOptions} />
			</div>
		</Card>
	</div>

	<Card class="p-0">
		<div class="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
			<p class="text-[12px] font-semibold tracking-[0.06em] text-muted-subtle uppercase">
				Rekap Perjalanan Dinas
			</p>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" onclick={exportExcel}>
					<FileDown size={14} /> Excel
				</Button>
				<Button variant="navy" size="sm" onclick={exportPdf}>
					<FileDown size={14} /> PDF
				</Button>
			</div>
		</div>
		<div class="px-6 pt-4 pb-6">
			<Table
				headers={[
					{ label: 'No. Pengajuan' },
					{ label: 'Tujuan' },
					{ label: 'Berangkat' },
					{ label: 'Kembali' },
					{ label: 'Anggaran', align: 'right' },
					{ label: 'Status' }
				]}
			>
				{#each trips as t (t.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-navy-deep">{t.id}</td>
						<td class="px-[12px] py-[13px] text-[13px] text-foreground">{t.tujuan}</td>
						<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
							>{dateId(t.berangkat)}</td
						>
						<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
							>{dateId(t.kembali)}</td
						>
						<td
							class="px-[12px] py-[13px] text-right text-[13px] font-semibold text-navy-deep tabular-nums"
						>
							{rupiah(t.anggaran)}
						</td>
						<td class="px-[12px] py-[13px]"><StatusBadge status={t.status} /></td>
					</tr>
				{/each}
			</Table>
		</div>
	</Card>
</div>
