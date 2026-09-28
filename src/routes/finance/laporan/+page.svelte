<script lang="ts">
	import LaporanView from '$lib/components/app/laporan-view.svelte';
</script>

<svelte:head><title>Laporan Keuangan — Astronova</title></svelte:head>

<div class="flex items-end justify-between gap-4">
	<div>
		<p class="text-meta font-semibold tracking-caps text-muted-subtle uppercase">
			Finance / Pelaporan
		</p>
		<h2 class="mt-1 font-heading text-display leading-tight font-medium text-navy-deep">
			Laporan Keuangan Dinas
		</h2>
		<p class="mt-1 max-w-2xl text-body-sm text-muted-foreground">
			Anggaran vs realisasi per bulan, distribusi kategori biaya, dan rekap perjalanan dinas.
		</p>
	</div>
</div>

<div class="mt-5">
	<LaporanView title="Laporan Keuangan Dinas" />
</div>
