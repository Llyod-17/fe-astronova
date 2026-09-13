<script lang="ts">
	import { Landmark, ScrollText, CheckCheck } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import {
		settlements,
		trips,
		verifikasiSettlement,
		tuntaskanSettlement,
		uangMukaTrip,
		realisasiTrip
	} from '$lib/state.svelte';
	import { rupiah } from '$lib/format';
	import { arahPembayaran } from '$lib/settlement';

	const rows = $derived(
		settlements.map((s) => {
			const t = trips.find((x) => x.id === s.tripId);
			const um = uangMukaTrip(s.tripId);
			const real = realisasiTrip(s.tripId) || (t?.uangMuka ?? 0);
			const arah = arahPembayaran(um, real);
			return { ...s, t, um, real, arah };
		})
	);
</script>

<svelte:head><title>Settlement — Finance</title></svelte:head>

<PageHeader
	supertitle="Finance / Keuangan"
	title="Rekonsiliasi Settlement"
	desc="Bandingkan uang muka dengan realisasi pengeluaran untuk menentukan arah pembayaran akhir."
/>

<div class="mt-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Uang Muka', align: 'right' },
				{ label: 'Realisasi', align: 'right' },
				{ label: 'Arah Pembayaran' },
				{ label: 'Nominal', align: 'right' },
				{ label: 'Status' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each rows as s (s.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{s.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{s.tripId}</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground tabular-nums"
						>{rupiah(s.um)}</td
					>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-navy-deep tabular-nums"
						>{rupiah(s.real)}</td
					>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{s.arah.label}</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(s.arah.nominal)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={s.status} /></td>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end gap-1.5">
							{#if s.status === 'diajukan'}
								<Button size="sm" variant="outline" onclick={() => verifikasiSettlement(s.id)}
									><CheckCheck size={13} /> Verifikasi</Button
								>
							{:else if s.status === 'diverifikasi'}
								<Button size="sm" onclick={() => tuntaskanSettlement(s.id)}
									><Landmark size={13} /> Tuntaskan</Button
								>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</Table>
	</Card>

	<div
		class="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-[12.5px] font-medium text-muted-foreground"
	>
		<ScrollText size={15} class="text-secondary" />
		Settlement impas tidak memicu transaksi pembayaran. Arah dihitung otomatis dari uang muka cair vs
		realisasi klaim.
	</div>
</div>
