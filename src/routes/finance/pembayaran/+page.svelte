<script lang="ts">
	import { Landmark } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { bayarReimbursement, reimbursements } from '$lib/state.svelte';
	import { rupiah } from '$lib/format';

	const queue = $derived(reimbursements.filter((r) => r.status === 'siap_bayar'));
	const total = $derived(queue.reduce((a, r) => a + r.jumlah, 0));
</script>

<svelte:head><title>Pembayaran — Finance</title></svelte:head>

<PageHeader
	supertitle="Finance / Keuangan"
	title="Pembayaran"
	desc="Daftar klaim yang telah disetujui dan siap ditransfer ke rekening karyawan."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Deskripsi' },
				{ label: 'Jumlah', align: 'right' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each queue as r (r.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{r.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{r.tripId}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
						>{r.kategori} — {r.deskripsi}</td
					>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(r.jumlah)}</td
					>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end">
							<Button size="sm" onclick={() => bayarReimbursement(r.id)}
								><Landmark size={13} /> Proses Transfer</Button
							>
						</div>
					</td>
				</tr>
			{/each}
		</Table>
		{#if queue.length === 0}
			<p class="py-8 text-center text-[13px] text-muted-subtle">Tidak ada pembayaran tertunda.</p>
		{/if}
	</Card>

	<Card class="self-start">
		<p class="font-heading text-[18px] font-medium text-navy-deep">Ringkasan Antrian</p>
		<p class="mt-1 text-[12.5px] text-muted-foreground">
			{queue.length} klaim menunggu transfer ke rekening karyawan.
		</p>
		<div class="mt-4 rounded-2xl bg-gradient-to-br from-[#eef4f8] to-[#f7fafc] px-4 py-4">
			<p class="text-[12px] font-medium text-muted-subtle">Total Pembayaran</p>
			<p class="mt-1 font-heading text-[26px] leading-tight font-medium text-navy-deep">
				{rupiah(total)}
			</p>
		</div>
		<div class="mt-3 rounded-2xl bg-ok-bg/40 px-4 py-3 text-[12.5px] font-medium text-ok-fg">
			Semua klaim berstatus <StatusBadge status="siap_bayar" /> tercatat dalam ledger pembayaran.
		</div>
	</Card>
</div>
