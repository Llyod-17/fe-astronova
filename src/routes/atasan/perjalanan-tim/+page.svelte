<script lang="ts">
	import { Users, TrendingUp } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import StatCard from '$lib/components/app/stat-card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import { trips, bookings } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';

	const selesai = $derived(trips.filter((t) => t.status === 'selesai').length);
	const totalAnggaran = $derived(trips.reduce((a, t) => a + t.anggaran, 0));
	const aktif = $derived(trips.filter((t) => t.status === 'berlangsung').length);
</script>

<svelte:head><title>Perjalanan Tim — Astronova</title></svelte:head>

<PageHeader
	supertitle="Atasan / Analitik"
	title="Perjalanan Tim"
	desc="Pemandangan menyeluruh aktivitas perjalanan dinas seluruh anggota tim."
/>

<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<StatCard label="Total Perjalanan" value={trips.length} note="pengajuan" />
	<StatCard
		label="Sedang Berlangsung"
		value={aktif}
		trend={`${aktif} trip aktif`}
		note="sekarang"
		trendDir="up"
	/>
	<StatCard
		label="Selesai"
		value={selesai}
		note="bulan ini"
		trend="sinkron dengan finance"
		trendDir="up"
	/>
	<StatCard label="Total Anggaran" value={totalAnggaran} note="anggaran" />
</div>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Anggota', align: 'right' },
				{ label: 'Rute' },
				{ label: 'Periode' },
				{ label: 'Anggaran', align: 'right' },
				{ label: 'Booking', align: 'right' },
				{ label: 'Status' }
			]}
		>
			{#each trips as t (t.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{t.id}</td>
					<td class="px-[12px] py-[13px] text-right">
						<span class="inline-flex items-center gap-2 text-[12.5px] font-medium text-navy-deep">
							<span
								class="grid h-7 w-7 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
								>AF</span
							>
							Ahmad Fauzi
						</span>
					</td>
					<td class="px-[12px] py-[13px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[13px] text-[12px] text-muted-foreground"
						>{dateId(t.berangkat)}</td
					>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(t.anggaran)}</td
					>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">
						{bookings.filter((b) => b.tripId === t.id).length} item
					</td>
					<td class="px-[12px] py-[13px]"><StatusBadge status={t.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Insight Singkat</p>
		<div class="grid gap-3">
			{#each [0, 1, 2] as i (i)}
				<div
					class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5"
				>
					<span
						class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"
					>
						<i>{i === 0 ? '✈' : i === 1 ? '🏨' : '🚗'}</i>
					</span>
					<div class="min-w-0">
						<p class="text-[12.5px] font-semibold text-navy-deep">
							{i === 0 ? 'Pesawat' : i === 1 ? 'Hotel' : 'Transportasi'}
						</p>
						<p class="text-[12px] text-muted-foreground">
							{i === 0
								? '3 penerbangan terkonfirmasi bulan ini'
								: i === 1
									? '2 penginapan terjadwal'
									: '5 klaim transportasi lokal'}
						</p>
					</div>
				</div>
			{/each}
		</div>
		<div
			class="mt-4 flex items-center gap-2 rounded-2xl bg-ok-bg/40 px-4 py-3 text-[12.5px] font-medium text-ok-fg"
		>
			<TrendingUp size={15} /> Efisiensi anggaran tim {Math.round(((selesai || 1) - 1) * 12)}% lebih
			baik dari kuartal lalu
		</div>
		<div
			class="mt-3 flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-[12.5px] font-medium text-muted-foreground"
		>
			<Users size={15} /> 1 anggota aktif berpergian hari ini
		</div>
	</Card>
</div>
