<script lang="ts">
	import { CircleCheck, CircleX } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import FilterPills from '$lib/components/app/filter-pills.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import { approveTrip, rejectTrip, trips } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';

	let filter = $state('menunggu_persetujuan');
	const pills = [
		{ key: 'menunggu_persetujuan', label: 'Menunggu' },
		{ key: 'disetujui', label: 'Disetujui' },
		{ key: 'ditolak', label: 'Ditolak' }
	];
	const rows = $derived(filter ? trips.filter((t) => t.status === filter) : trips);

	function setuju(id: string) {
		const catatan = window.prompt('Catatan persetujuan (opsional):');
		approveTrip(id, catatan ?? undefined);
	}
	function tolak(id: string) {
		const catatan = window.prompt('Alasan penolakan:');
		if (catatan) rejectTrip(id, catatan);
	}
</script>

<svelte:head><title>Approval — Astronova</title></svelte:head>

<PageHeader
	supertitle="Atasan / Persetujuan"
	title="Approval Perjalanan"
	desc="Seluruh pengajuan yang pernah atau sedang membutuhkan keputusan Anda, dengan jejak audit."
/>

<div class="mt-5 grid gap-5">
	<div><FilterPills options={pills} bind:value={filter} /></div>
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Pemohon' },
				{ label: 'Rute' },
				{ label: 'Periode' },
				{ label: 'Keperluan' },
				{ label: 'Anggaran', align: 'right' },
				{ label: 'Status' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each rows as t (t.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{t.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] font-medium text-navy-deep">Ahmad Fauzi</td>
					<td class="px-[12px] py-[13px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[13px] text-[12px] text-muted-foreground"
						>{dateId(t.berangkat)} — {dateId(t.kembali)}</td
					>
					<td class="max-w-[200px] truncate px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
						>{t.keperluan}</td
					>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(t.anggaran)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={t.status} /></td>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end gap-1.5">
							{#if t.status === 'menunggu_persetujuan'}
								<Button size="sm" onclick={() => setuju(t.id)}
									><CircleCheck size={13} /> Setujui</Button
								>
								<Button size="sm" variant="outline" onclick={() => tolak(t.id)}
									><CircleX size={13} /> Tolak</Button
								>
							{:else}
								<span class="text-[11.5px] text-muted-subtle">—</span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</Table>
		{#if rows.length === 0}
			<p class="py-8 text-center text-[13px] text-muted-subtle">Tidak ada data pada filter ini.</p>
		{/if}
	</Card>
</div>
