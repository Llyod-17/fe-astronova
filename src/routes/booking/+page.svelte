<script lang="ts">
	import { Plane, Hotel, TrainFront, Car } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { bookings, trips } from '$lib/state.svelte';
	import { rupiah } from '$lib/format';

	const iconBy = (jenis: string) =>
		jenis === 'Tiket Pesawat'
			? Plane
			: jenis === 'Hotel'
				? Hotel
				: jenis === 'Kereta'
					? TrainFront
					: Car;

	const withTrip = $derived(
		bookings.map((b) => ({ ...b, trip: trips.find((t) => t.id === b.tripId) }))
	);
</script>

<svelte:head><title>Booking Saya — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Perjalanan"
	title="Booking & Itinerary"
	desc="Tiket, hotel, dan transportasi yang dipesan oleh Admin Travel untuk perjalanan Anda."
/>

<div class="mt-5 grid gap-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: '' },
				{ label: 'Detail' },
				{ label: 'Referensi' },
				{ label: 'Vendor' },
				{ label: 'Trip', align: 'right' },
				{ label: 'Harga', align: 'right' },
				{ label: 'Status' }
			]}
		>
			{#each withTrip as b (b.id)}
				<tr class="border-b border-border transition-colors last:border-0 hover:bg-muted/40">
					<td class="px-[14px] py-[14px]">
						<span
							class="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"
						>
							{#snippet Iicon()}{@const Icon = iconBy(b.jenis)}<Icon size={16} />{/snippet}
							{@render Iicon()}
						</span>
					</td>
					<td class="px-[12px] py-[14px]">
						<p class="text-[12.5px] font-semibold text-navy-deep">{b.jenis}</p>
						<p class="text-[12px] text-muted-foreground">{b.detail}</p>
					</td>
					<td class="px-[12px] py-[14px]"
						><code class="rounded-md bg-muted px-2 py-1 text-[11.5px] font-medium text-primary"
							>{b.nomorRef}</code
						></td
					>
					<td class="px-[12px] py-[14px] text-[12.5px] text-muted-foreground">{b.vendor}</td>
					<td class="px-[12px] py-[14px] text-right"
						><Badge tone="neutral">{b.trip?.id ?? '—'}</Badge></td
					>
					<td class="px-[12px] py-[14px] text-right text-[12.5px] font-semibold text-navy-deep"
						>{rupiah(b.harga)}</td
					>
					<td class="px-[12px] py-[14px]"><StatusBadge status={b.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
