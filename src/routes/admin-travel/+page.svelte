<script lang="ts">
	import { ClipboardList, Plane, CalendarDays, Building2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import StatCard from '$lib/components/app/stat-card.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { setBookingStatus, bookings, trips, vendors } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';
	import type { Booking } from '$lib/types';

	const approved = $derived(trips.filter((t) => t.status === 'disetujui'));
	const needsBooking = $derived(bookings.filter((b) => b.status === 'pending'));
	const totalValue = $derived(bookings.reduce((a, b) => a + b.harga, 0));

	function konfirmasi(id: string, status: Booking['status']) {
		setBookingStatus(id, status);
	}
</script>

<svelte:head><title>Dashboard Travel — Astronova</title></svelte:head>

<PageHeader
	supertitle="Admin Travel / Operasional"
	title="Dashboard Travel"
	desc="Kelola permintaan perjalanan, booking, itinerary, dan vendor dalam satu alur."
/>

<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<StatCard label="Request Disetujui" value={approved.length} note="menunggu booking" />
	<StatCard
		label="Booking Tertunda"
		value={needsBooking.length}
		trend="perlu konfirmasi"
		note="vendor"
		trendDir="up"
	/>
	<StatCard label="Total Nilai Booking" value={totalValue} note="terkonfirmasi" />
	<StatCard label="Vendor Terdaftar" value={vendors.length} note="partner" />
</div>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
	<Card>
		<div class="mb-4 flex items-center justify-between">
			<p class="font-heading text-[18px] font-medium text-navy-deep">Booking Pending Konfirmasi</p>
			<StatusBadge status="pending" />
		</div>
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Detail' },
				{ label: 'Vendor' },
				{ label: 'Harga', align: 'right' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each needsBooking as b (b.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{b.id}</td>
					<td class="px-[12px] py-[13px]">
						<p class="text-[12.5px] font-semibold text-navy-deep">{b.jenis}</p>
						<p class="text-[12px] text-muted-foreground">{b.detail}</p>
					</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{b.vendor}</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(b.harga)}</td
					>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end gap-1.5">
							<Button size="sm" onclick={() => konfirmasi(b.id, 'confirmed')}>Konfirmasi</Button>
							<Button size="sm" variant="outline" onclick={() => konfirmasi(b.id, 'cancelled')}
								>Batal</Button
							>
						</div>
					</td>
				</tr>
			{/each}
		</Table>
		{#if needsBooking.length === 0}
			<p class="py-8 text-center text-[13px] text-muted-subtle">Tidak ada booking tertunda.</p>
		{/if}
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">List Kontrol</p>
		<div class="grid gap-2.5">
			<a
				href="/admin-travel/request"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ClipboardList size={16} /></span
				>
				Request Perjalanan
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{approved.length} siap</span
				>
			</a>
			<a
				href="/admin-travel/booking"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Plane size={16} /></span
				>
				Kelola Booking
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{bookings.length} total</span
				>
			</a>
			<a
				href="/admin-travel/itinerary"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><CalendarDays size={16} /></span
				>
				Susun Itinerary
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{trips.filter((t) => t.status === 'berlangsung').length} aktif</span
				>
			</a>
			<a
				href="/admin-travel/vendor"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Building2 size={16} /></span
				>
				Vendor Travel
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{vendors.length} partner</span
				>
			</a>
		</div>

		<p class="mt-5 mb-2 font-heading text-[16px] font-medium text-navy-deep">Perjalanan Aktif</p>
		<div class="grid gap-2">
			{#each trips.filter((t) => t.status === 'berlangsung') as t (t.id)}
				<div
					class="bg-surface flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
				>
					<div>
						<p class="text-[12.5px] font-semibold text-navy-deep">{t.id} · {t.kota}</p>
						<p class="text-[11.5px] text-muted-subtle">
							{dateId(t.berangkat)} — {dateId(t.kembali)}
						</p>
					</div>
					<StatusBadge status={t.status} />
				</div>
			{/each}
		</div>
	</Card>
</div>
