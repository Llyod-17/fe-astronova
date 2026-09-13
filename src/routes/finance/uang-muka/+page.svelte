<script lang="ts">
	import { Wallet } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { cairkanDana, dana, trips } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';

	const rows = $derived(dana.map((d) => ({ ...d, t: trips.find((x) => x.id === d.tripId) })));
</script>

<svelte:head><title>Uang Muka — Finance</title></svelte:head>

<PageHeader
	supertitle="Finance / Keuangan"
	title="Pencairan Uang Muka"
	desc="Proses pengajuan cash advance setelah disetujui atasan."
/>

<div class="mt-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Pemohon' },
				{ label: 'Diajukan', align: 'right' },
				{ label: 'Dicairkan', align: 'right' },
				{ label: 'Tanggal' },
				{ label: 'Status' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each rows as d (d.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{d.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
						>{d.tripId} · {d.t?.kota ?? '—'}</td
					>
					<td class="px-[12px] py-[13px] text-[12.5px] font-medium text-navy-deep">Ahmad Fauzi</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(d.diajukan)}</td
					>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground tabular-nums"
						>{d.disetujui > 0 ? rupiah(d.disetujui) : '—'}</td
					>
					<td class="px-[12px] py-[13px] text-[12px] text-muted-foreground">{dateId(d.tanggal)}</td>
					<td class="px-[12px] py-[13px]"><StatusBadge status={d.status} /></td>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end">
							{#if d.status === 'diajukan'}
								<Button size="sm" onclick={() => cairkanDana(d.id)}
									><Wallet size={13} /> Cairkan</Button
								>
							{:else}
								<span class="text-[11.5px] text-muted-subtle">Terkirim</span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
