<script lang="ts">
	import LaporanView from '$lib/components/app/laporan-view.svelte';
</script>

<svelte:head><title>Laporan — Astronova</title></svelte:head>

<div class="flex items-end justify-between gap-4">
	<div>
		<p class="text-meta font-semibold tracking-caps text-muted-subtle uppercase">
			Atasan / Analitik
		</p>
		<h2 class="mt-1 font-heading text-display leading-tight font-medium text-navy-deep">
			Laporan Perjalanan Tim
		</h2>
		<p class="mt-1 max-w-2xl text-body-sm text-muted-foreground">
			Rekap anggaran, realisasi, dan status seluruh perjalanan dinas tim. Ekspor ke Excel / PDF.
		</p>
	</div>
</div>

<div class="mt-5">
	<LaporanView title="Laporan Perjalanan Tim" />
</div>
