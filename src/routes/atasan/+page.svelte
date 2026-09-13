<script lang="ts">
	import { CircleCheck, ClipboardList, UserCog, Users } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import StatCard from '$lib/components/app/stat-card.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import { approveTrip, currentUser, rejectTrip, trips } from '$lib/state.svelte';
	import { dateId, rupiah, initials } from '$lib/format';

	const totalReguler = $derived(trips.length);
	const pendingQueue = $derived(trips.filter((t) => t.status === 'menunggu_persetujuan'));
	const disetujui = $derived(trips.filter((t) => t.status === 'disetujui').length);
	const ditolak = $derived(trips.filter((t) => t.status === 'ditolak').length);

	function setuju(id: string) {
		if (window.confirm(`Setujui pengajuan ${id}?`)) approveTrip(id);
	}
	function tolak(id: string) {
		const catatan = window.prompt('Alasan penolakan:');
		if (catatan) rejectTrip(id, catatan);
	}
</script>

<svelte:head><title>Dashboard Atasan — Astronova</title></svelte:head>

<PageHeader
	supertitle={`Atasan / ${currentUser().departemen}`}
	title="Dashboard Persetujuan"
	desc="Ringkasan pengajuan perjalanan dinas yang menunggu keputusan Anda."
/>

<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<StatCard label="Total Pengajuan Perjalanan" value={totalReguler} note="pengajuan" />
	<StatCard
		label="Menunggu Persetujuan"
		value={pendingQueue.length}
		trend="butuh aksi"
		note="hari ini"
		trendDir="up"
	/>
	<StatCard
		label="Disetujui"
		value={disetujui}
		trend="lanjut booking"
		note="bulan ini"
		trendDir="up"
	/>
	<StatCard label="Ditolak" value={ditolak} trendDir="down" trend="perlu rapat" note="review" />
</div>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
	<Card>
		<div class="mb-4 flex items-center justify-between">
			<p class="font-heading text-[18px] font-medium text-navy-deep">Antrian Persetujuan</p>
			<StatusBadge status="menunggu_persetujuan" />
		</div>
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Pemohon' },
				{ label: 'Rute' },
				{ label: 'Periode' },
				{ label: 'Anggaran', align: 'right' },
				{ label: 'Aksi', align: 'right' }
			]}
		>
			{#each pendingQueue as t (t.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{t.id}</td>
					<td class="px-[12px] py-[13px]">
						<div class="flex items-center gap-2">
							<span
								class="grid h-7 w-7 place-items-center rounded-full bg-accent text-[10.5px] font-bold text-accent-foreground"
							>
								{initials('Ahmad Fauzi')}
							</span>
							<span class="text-[12.5px] font-medium text-navy-deep">Ahmad Fauzi</span>
						</div>
					</td>
					<td class="px-[12px] py-[13px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[13px] text-[12px] text-muted-foreground"
						>{dateId(t.berangkat)}</td
					>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(t.anggaran)}</td
					>
					<td class="px-[12px] py-[13px]">
						<div class="flex justify-end gap-1.5">
							<Button size="sm" onclick={() => setuju(t.id)}
								><CircleCheck size={13} /> Setujui</Button
							>
							<Button size="sm" variant="outline" onclick={() => tolak(t.id)}>Tolak</Button>
						</div>
					</td>
				</tr>
			{/each}
		</Table>
		{#if pendingQueue.length === 0}
			<p class="py-8 text-center text-[13px] text-muted-subtle">
				Semua pengajuan sudah diproses. Mantap!
			</p>
		{/if}
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Blok Cepat</p>
		<div class="grid gap-2.5">
			<a
				href="/atasan/approval"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ClipboardList size={16} /></span
				>
				Approval & Delegasi
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{pendingQueue.length} antrean</span
				>
			</a>
			<a
				href="/atasan/perjalanan-tim"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Users size={16} /></span
				>
				Perjalanan Tim
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle">{totalReguler} trip</span>
			</a>
			<a
				href="/atasan/laporan"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><UserCog size={16} /></span
				>
				Delegasi Approval
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle">Atur wakil</span>
			</a>
		</div>
		<div
			class="mt-4 rounded-2xl border border-border bg-gradient-to-br from-[#eef4f8] to-[#f7fafc] px-4 py-4"
		>
			<p class="text-[12px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
				Aturan Persetujuan
			</p>
			<ul class="mt-2 space-y-1.5 text-[12.5px] text-muted-foreground">
				<li>• Persetujuan tunggal (1 level) untuk ≤ Rp 10 Jt</li>
				<li>• Di atas Rp 10 Jt memerlukan level ke-2</li>
				<li>• Delegasi aktif selama Anda tidak di tempat</li>
			</ul>
		</div>
	</Card>
</div>
