<script lang="ts">
	import { ClipboardList } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import { trips } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';

	const requests = $derived(
		trips.filter(
			(t) => t.status === 'disetujui' || t.status === 'draft' || t.status === 'menunggu_persetujuan'
		)
	);
</script>

<svelte:head><title>Request Perjalanan — Astronova</title></svelte:head>

<PageHeader
	supertitle="Admin Travel / Operasional"
	title="Request Perjalanan"
	desc="Permintaan perjalanan yang telah disetujui atasan dan siap diproses menjadi booking."
/>

<div class="mt-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Rute' },
				{ label: 'Periode' },
				{ label: 'Pemohon' },
				{ label: 'Anggaran', align: 'right' },
				{ label: 'Status' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each requests as t (t.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{t.id}</td>
					<td class="px-[12px] py-[13px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[13px] text-[12px] text-muted-foreground"
						>{dateId(t.berangkat)} — {dateId(t.kembali)}</td
					>
					<td class="px-[12px] py-[13px] text-[12.5px] font-medium text-navy-deep">Ahmad Fauzi</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(t.anggaran)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={t.status} /></td>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end">
							{#if t.status === 'disetujui'}
								<a href="/admin-travel/booking"
									><Button size="sm"><ClipboardList size={13} /> Buat Booking</Button></a
								>
							{:else}
								<span class="text-[11.5px] text-muted-subtle">Belum dapat diproses</span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
