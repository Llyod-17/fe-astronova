<script lang="ts">
	import { Landmark, ReceiptText, ScrollText, Wallet } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import StatCard from '$lib/components/app/stat-card.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import {
		cairkanDana,
		dana,
		reimbursements,
		settlements,
		verifikasiSettlement,
		tuntaskanSettlement
	} from '$lib/state.svelte';
	import { rupiah } from '$lib/format';

	const pendingCair = $derived(dana.filter((d) => d.status === 'diajukan'));
	const pendingVerif = $derived(reimbursements.filter((r) => r.status === 'diverifikasi'));
	const siapBayar = $derived(reimbursements.filter((r) => r.status === 'siap_bayar'));
	const nodigSettle = $derived(settlements.filter((s) => s.status === 'diajukan'));
	const totalCair = $derived(dana.reduce((a, d) => a + d.disetujui, 0));
	const totalKlaim = $derived(reimbursements.reduce((a, r) => a + r.jumlah, 0));
</script>

<svelte:head><title>Dashboard Finance — Astronova</title></svelte:head>

<PageHeader
	supertitle="Finance / Keuangan"
	title="Dashboard Finance"
	desc="Pusat kendali pencairan uang muka, verifikasi klaim, dan rekonsiliasi settlement."
/>

<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<StatCard label="Dana Dicairkan" value={totalCair} note="uang muka" />
	<StatCard
		label="Total Klaim"
		value={totalKlaim}
		trend="merujuk reimbursement"
		note="diverifikasi + siap bayar"
		trendDir="up"
	/>
	<StatCard
		label="Antrian Uang Muka"
		value={pendingCair.length}
		trend="perlu cairkan"
		note="proses"
		trendDir="up"
	/>
	<StatCard
		label="Pending Settlement"
		value={nodigSettle.length}
		trend="rekon"
		note="trip selesai"
		trendDir="up"
	/>
</div>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
	<Card>
		<div class="mb-4 flex items-center justify-between">
			<p class="font-heading text-[18px] font-medium text-navy-deep">
				Uang Muka Menunggu Pencairan
			</p>
			<StatusBadge status="diajukan" />
		</div>
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Diajukan', align: 'right' },
				{ label: 'Tanggal' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each pendingCair as d (d.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{d.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{d.tripId}</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(d.diajukan)}</td
					>
					<td class="px-[12px] py-[13px] text-[12px] text-muted-foreground">{d.tanggal}</td>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end">
							<Button size="sm" onclick={() => cairkanDana(d.id)}
								><Wallet size={13} /> Cairkan</Button
							>
						</div>
					</td>
				</tr>
			{/each}
		</Table>
		{#if pendingCair.length === 0}
			<p class="py-8 text-center text-[13px] text-muted-subtle">Tidak ada antrian pencairan.</p>
		{/if}
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">List Kontrol</p>
		<div class="grid gap-2.5">
			<a
				href="/finance/reimbursement"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ReceiptText size={16} /></span
				>
				Verif. Reimbursement
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{pendingVerif.length} antrean</span
				>
			</a>
			<a
				href="/finance/pembayaran"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Landmark size={16} /></span
				>
				Pembayaran Siap
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{siapBayar.length} tugas</span
				>
			</a>
			<a
				href="/finance/settlement"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ScrollText size={16} /></span
				>
				Rekonsiliasi Settlement
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{nodigSettle.length} perlu di-rekon</span
				>
			</a>
		</div>

		<div
			class="mt-4 rounded-2xl border border-border bg-gradient-to-br from-[#eef4f8] to-[#f7fafc] px-4 py-4"
		>
			<p class="text-[12px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
				Settlement Aktif
			</p>
			<div class="mt-2 grid gap-2">
				{#each nodigSettle as s (s.id)}
					<div
						class="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5"
					>
						<div>
							<p class="text-[12.5px] font-semibold text-navy-deep">{s.id} · {s.tripId}</p>
							<p class="text-[11.5px] text-muted-subtle">Realisasi {rupiah(s.totalRealisasi)}</p>
						</div>
						<div class="flex gap-1.5">
							<Button size="sm" variant="outline" onclick={() => verifikasiSettlement(s.id)}
								>Verif</Button
							>
							<Button size="sm" onclick={() => tuntaskanSettlement(s.id)}>Selesai</Button>
						</div>
					</div>
				{/each}
				{#if nodigSettle.length === 0}
					<p class="text-[12.5px] text-muted-subtle">Tidak ada settlement menunggu.</p>
				{/if}
			</div>
		</div>
	</Card>
</div>
