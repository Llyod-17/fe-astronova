<script lang="ts">
	import { Landmark } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import {
		settlements,
		trips,
		submitSettlement,
		uangMukaTrip,
		realisasiTrip
	} from '$lib/state.svelte';
	import { rupiah } from '$lib/format';
	import { hitungSelisih } from '$lib/settlement';

	const activeTrip = $derived(
		trips.find(
			(t) => t.status === 'berlangsung' || t.status === 'selesai' || t.status === 'disetujui'
		)
	);
	const existingIds = $derived(new Set(settlements.map((s) => s.tripId)));

	const rows = $derived(
		settlements.map((s) => {
			const t = trips.find((x) => x.id === s.tripId);
			const um = uangMukaTrip(s.tripId);
			const real = realisasiTrip(s.tripId) || (t?.uangMuka ?? 0);
			const { selisih, jenis } = hitungSelisih(um, real);
			return { ...s, t, um, real, selisih, jenis };
		})
	);
</script>

<svelte:head><title>Settlement — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Keuangan"
	title="Settlement Perjalanan"
	desc="Rekonsiliasi uang muka dengan pengeluaran aktual per perjalanan dinas."
>
	{#snippet actions()}
		{#if activeTrip && !existingIds.has(activeTrip.id)}
			<Button onclick={() => submitSettlement(activeTrip.id)}
				><Landmark size={15} /> Submit Settlement {activeTrip.id}</Button
			>
		{/if}
	{/snippet}
</PageHeader>

<div class="mt-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Uang Muka', align: 'right' },
				{ label: 'Realisasi', align: 'right' },
				{ label: 'Selisih', align: 'right' },
				{ label: 'Arah' },
				{ label: 'Status' }
			]}
		>
			{#each rows as r (r.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[14px] text-[12.5px] font-semibold text-primary">{r.id}</td>
					<td class="px-[12px] py-[14px]">
						<p class="text-[12.5px] font-medium text-navy-deep">{r.tripId}</p>
						<p class="text-[12px] text-muted-foreground">{r.t?.kota ?? '—'}</p>
					</td>
					<td class="px-[12px] py-[14px] text-right text-[12.5px] text-muted-foreground"
						>{rupiah(r.um)}</td
					>
					<td class="px-[12px] py-[14px] text-right text-[12.5px] text-muted-foreground"
						>{rupiah(r.real)}</td
					>
					<td class="px-[12px] py-[14px] text-right text-[12.5px] font-semibold text-navy-deep"
						>{r.selisih < 0 ? '−' : ''}{rupiah(Math.abs(r.selisih))}</td
					>
					<td class="px-[12px] py-[14px] text-[12.5px] text-muted-foreground">
						{#if r.jenis === 'kurang_bayar'}Tambahan bayar
						{:else if r.jenis === 'lebih_bayar'}Kembalikan sisa
						{:else}Impas{/if}
					</td>
					<td class="px-[12px] py-[14px]"><StatusBadge status={r.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
