<script lang="ts">
	import { CalendarDays, MapPin } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import FilterPills from '$lib/components/app/filter-pills.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { trips, itinerary } from '$lib/state.svelte';
	import { daysBetween, dateId, rupiah } from '$lib/format';

	let statusFilter = $state('');
	const pills = [
		{ key: 'menunggu_persetujuan', label: 'Menunggu Persetujuan' },
		{ key: 'disetujui', label: 'Disetujui' },
		{ key: 'berlangsung', label: 'Berlangsung' },
		{ key: 'selesai', label: 'Selesai' },
		{ key: 'ditolak', label: 'Ditolak' }
	];
	const filtered = $derived(statusFilter ? trips.filter((t) => t.status === statusFilter) : trips);
	let openTrip = $state('TRIP-2026-001');
</script>

<svelte:head><title>Perjalanan Saya — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Perjalanan"
	title="Perjalanan Saya"
	desc="Rekap seluruh perjalanan dinas beserta itinerary dan status terkini."
/>

<div class="mt-5">
	<FilterPills options={pills} bind:value={statusFilter} />
</div>

<div class="mt-4 grid gap-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Rute' },
				{ label: 'Periode' },
				{ label: 'Keperluan' },
				{ label: 'Anggaran' },
				{ label: 'Status' },
				{ label: '' }
			]}
		>
			{#each filtered as t (t.id)}
				<tr
					class="cursor-pointer border-b border-border transition-colors {openTrip === t.id
						? 'bg-muted/50'
						: ''} last:border-0 hover:bg-muted/40"
					onclick={() => (openTrip = openTrip === t.id ? '' : t.id)}
				>
					<td class="px-[12px] py-[14px] text-[12.5px] font-semibold text-primary">{t.id}</td>
					<td class="px-[12px] py-[14px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[14px] text-[12.5px] text-muted-foreground"
						>{dateId(t.berangkat)} — {dateId(t.kembali)}</td
					>
					<td class="max-w-[260px] truncate px-[12px] py-[14px] text-[12.5px] text-muted-foreground"
						>{t.keperluan}</td
					>
					<td class="px-[12px] py-[14px] text-[12.5px] font-semibold text-navy-deep"
						>{rupiah(t.anggaran)}</td
					>
					<td class="px-[12px] py-[14px]"><StatusBadge status={t.status} /></td>
					<td
						class="px-[12px] py-[14px] text-[10.5px] font-semibold tracking-[0.05em] text-muted-subtle uppercase"
					>
						{openTrip === t.id ? 'Tutup' : 'Itinerary'}
					</td>
				</tr>
				{#if openTrip === t.id}
					<tr class="border-b border-border bg-muted/30 last:border-0">
						<td class="px-[12px] py-[14px]" colspan="7">
							<div class="flex flex-wrap items-center gap-x-10 gap-y-3 px-1 py-2">
								<div class="flex items-center gap-2 text-[12.5px] text-muted-foreground">
									<CalendarDays size={14} class="text-secondary" />
									{daysBetween(t.berangkat, t.kembali)} hari
								</div>
								<div class="flex items-center gap-2 text-[12.5px] text-muted-foreground">
									<MapPin size={14} class="text-secondary" />
									{t.tujuan}
								</div>
								<Badge tone="sky">Proyek: {t.proyek}</Badge>
								<div class="flex flex-wrap gap-1.5">
									{#each itinerary.filter((i) => i.tripId === t.id) as it (it.id)}
										<span
											class="rounded-full border border-border bg-card px-3 py-1 text-[12px] font-medium text-muted-foreground"
										>
											<span class="font-semibold text-navy-deep">{it.waktu}</span> · {it.aktivitas}
										</span>
									{/each}
								</div>
							</div>
						</td>
					</tr>
				{/if}
			{/each}
		</Table>
	</Card>
</div>
