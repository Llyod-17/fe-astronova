<script lang="ts">
	import StatCard from '$lib/components/app/stat-card.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import { dana, notifications, reimbursements, settlements, trips } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';
	import { ArrowRight, CircleDollarSign, Hotel, Plane } from 'lucide-svelte';
</script>

<svelte:head><title>Dashboard — Astronova</title></svelte:head>

<div class="grid gap-5">
	<div class="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
		<StatCard
			label="Pengajuan Aktif"
			value={trips.filter((t) =>
				['menunggu_persetujuan', 'disetujui', 'berlangsung'].includes(t.status)
			).length}
			trend="3 menunggu approval"
			note="bulan ini"
		/>
		<StatCard
			label="Uang Muka Berjalan"
			value={dana.filter((d) => d.status === 'dicairkan').reduce((s, d) => s + d.disetujui, 0)}
			trend="Rp dicairkan"
			note="total berjalan"
		/>
		<StatCard
			label="Settlement Pending"
			value={settlements.filter((s) => s.status !== 'selesai').length}
			trend="1 perlu tindakan"
			trendDir="down"
		/>
		<StatCard
			label="Anggaran Periode Ini"
			value={trips
				.filter((t) => t.berangkat.startsWith(new Date().getFullYear().toString()))
				.reduce((s, t) => s + t.anggaran, 0)}
			trend="89% tersisa"
		/>
	</div>

	<div class="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
		<Card>
			<div class="mb-4 flex items-center justify-between">
				<p class="font-heading text-[18px] font-medium text-navy-deep">Pengajuan Terbaru</p>
				<a
					href="/perjalanan-saya"
					class="inline-flex items-center gap-1 text-[12px] font-semibold text-secondary hover:underline"
				>
					Lihat semua <ArrowRight size={13} />
				</a>
			</div>
			<Table
				headers={[
					{ label: 'No. Pengajuan' },
					{ label: 'Rute' },
					{ label: 'Tujuan' },
					{ label: 'Tanggal' },
					{ label: 'Anggaran', align: 'right' },
					{ label: 'Status' }
				]}
			>
				{#each trips.slice(0, 5) as t (t.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-navy-deep">{t.id}</td>
						<td class="px-[12px] py-[13px]"><RouteCell from="CGK" to={t.kota} /></td>
						<td class="px-[12px] py-[13px] text-[13px] text-foreground">{t.tujuan}</td>
						<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
							>{dateId(t.berangkat)}</td
						>
						<td
							class="px-[12px] py-[13px] text-right text-[13px] font-semibold text-navy-deep tabular-nums"
							>{rupiah(t.anggaran)}</td
						>
						<td class="px-[12px] py-[13px]"><StatusBadge status={t.status} /></td>
					</tr>
				{/each}
			</Table>
		</Card>

		<Card>
			<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Notifikasi Terbaru</p>
			<div class="space-y-1">
				{#each notifications.slice(0, 5) as n (n.id)}
					<div class="flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60">
						<span
							class={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dibaca ? 'bg-muted-subtle/40' : 'bg-alert-dot'}`}
						></span>
						<div class="min-w-0">
							<p class="text-[13px] font-semibold text-navy-deep">{n.judul}</p>
							<p class="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{n.isidata}</p>
							<p
								class="mt-1 text-[10.5px] font-medium tracking-[0.04em] text-muted-subtle uppercase"
							>
								{n.waktu}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</Card>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<Card padding="stat" class="rounded-[20px]">
			<div class="flex items-center gap-2.5">
				<div class="grid h-9 w-9 place-items-center rounded-full bg-sky-bg text-sky-fg">
					<Plane size={16} />
				</div>
				<div>
					<p class="text-[11.5px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
						Booking Konfirmasi
					</p>
					<p class="font-heading text-[19px] font-medium text-navy-deep">4 perjalanan</p>
				</div>
			</div>
		</Card>
		<Card padding="stat" class="rounded-[20px]">
			<div class="flex items-center gap-2.5">
				<div class="grid h-9 w-9 place-items-center rounded-full bg-ok-bg text-ok-fg">
					<Hotel size={16} />
				</div>
				<div>
					<p class="text-[11.5px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
						Hotel Aktif
					</p>
					<p class="font-heading text-[19px] font-medium text-navy-deep">2 malam</p>
				</div>
			</div>
		</Card>
		<Card padding="stat" class="rounded-[20px]">
			<div class="flex items-center gap-2.5">
				<div class="grid h-9 w-9 place-items-center rounded-full bg-pend-bg text-pend-fg">
					<CircleDollarSign size={16} />
				</div>
				<div>
					<p class="text-[11.5px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
						Reimbursement Pending
					</p>
					<p class="font-heading text-[19px] font-medium text-navy-deep">
						{reimbursements.filter((r) => r.status === 'diajukan').length} klaim
					</p>
				</div>
			</div>
		</Card>
		<Card padding="stat" class="rounded-[20px]">
			<div class="flex items-center gap-2.5">
				<div class="grid h-9 w-9 place-items-center rounded-full bg-bad-bg text-bad-fg">
					<Plane size={16} />
				</div>
				<div>
					<p class="text-[11.5px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
						Menuju Berangkat
					</p>
					<p class="font-heading text-[19px] font-medium text-navy-deep">2 perjalanan</p>
				</div>
			</div>
		</Card>
	</div>
</div>
