<script lang="ts">
	import LaporanView from '$lib/components/app/laporan-view.svelte';
</script>

<svelte:head><title>Laporan Keuangan — Astronova</title></svelte:head>

<div class="flex items-end justify-between gap-4">
	<div>
		<p class="text-[12px] font-semibold tracking-[0.08em] text-muted-subtle uppercase">
			Finance / Pelaporan
		</p>
		<h2 class="mt-1 font-heading text-[26px] leading-tight font-medium text-navy-deep">
			Laporan Keuangan Dinas
		</h2>
		<p class="mt-1 max-w-2xl text-[13px] text-muted-foreground">
			Anggaran vs realisasi per bulan, distribusi kategori biaya, dan rekap perjalanan dinas.
		</p>
	</div>
</div>

<div class="mt-5">
	<LaporanView title="Laporan Keuangan Dinas" />
</div>
