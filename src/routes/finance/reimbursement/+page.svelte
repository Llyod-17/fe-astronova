<script lang="ts">
	import { CheckCircle2, CircleCheck, ReceiptText } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { bayarReimbursement, reimbursements, verifikasiReimbursement } from '$lib/state.svelte';
	import { rupiah } from '$lib/format';

	function verif(id: string) {
		verifikasiReimbursement(id, false);
	}
	function setujui(id: string) {
		verifikasiReimbursement(id, true);
	}
</script>

<svelte:head><title>Reimbursement — Finance</title></svelte:head>

<PageHeader
	supertitle="Finance / Keuangan"
	title="Verifikasi Reimbursement"
	desc="Periksa kebenaran klaim dan bukti, lalu tanda-tangani untuk pembayaran."
/>

<div class="mt-5">
	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Kategori' },
				{ label: 'Deskripsi' },
				{ label: 'Bukti' },
				{ label: 'Jumlah', align: 'right' },
				{ label: 'Status' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each reimbursements as r (r.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{r.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{r.tripId}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{r.kategori}</td>
					<td class="max-w-[200px] truncate px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
						>{r.deskripsi}</td
					>
					<td class="px-[12px] py-[13px]"
						><code class="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-primary"
							>{r.bukti}</code
						></td
					>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(r.jumlah)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={r.status} /></td>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end gap-1.5">
							{#if r.status === 'diajukan'}
								<Button size="sm" onclick={() => verif(r.id)}
									><CheckCircle2 size={13} /> Verifikasi</Button
								>
							{:else if r.status === 'diverifikasi'}
								<Button size="sm" onclick={() => setujui(r.id)}
									><CircleCheck size={13} /> Setujui</Button
								>
							{:else if r.status === 'siap_bayar'}
								<Button size="sm" variant="navy" onclick={() => bayarReimbursement(r.id)}
									><ReceiptText size={13} /> Bayar</Button
								>
							{:else}
								<span class="text-[11.5px] text-muted-subtle">Selesai</span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
