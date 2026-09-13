<script lang="ts">
	import { Database, GitBranch, Plug, ScrollText, ShieldCheck, Users } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import StatCard from '$lib/components/app/stat-card.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import { departments, policies, proyeks, currentUser } from '$lib/state.svelte';
	import { rupiah } from '$lib/format';
	import Badge from '$lib/components/ui/badge.svelte';

	const totalUsers = 210;
</script>

<svelte:head><title>Dashboard Super Admin — Astronova</title></svelte:head>

<PageHeader
	supertitle={`Super Admin / ${currentUser().departemen}`}
	title="Pusat Administrasi"
	desc="Konfigurasi sistem, keamanan, master data, dan kesehatan seluruh modul travel."
/>

<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<StatCard label="Total Pengguna" value={totalUsers} note="aktif" />
	<StatCard label="Departemen" value={departments.length} note="unit kerja" />
	<StatCard label="Proyek Aktif" value={proyeks.length} note="kode proyek" />
	<StatCard label="Kebijakan Travel" value={policies.length} note="grade" />
</div>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
	<Card padding="none">
		<div class="flex items-center justify-between px-6 pt-6">
			<p class="font-heading text-[18px] font-medium text-navy-deep">Kesehatan Sistem</p>
			<Badge tone="ok">Semua modul OK</Badge>
		</div>
		<div class="px-6 pt-4 pb-6">
			<Table
				headers={[
					{ label: 'Modul' },
					{ label: 'Status' },
					{ label: 'Latency', align: 'right' },
					{ label: 'Laporan', align: 'right' }
				]}
			>
				<tr class="border-b border-border last:border-0">
					<td class="px-[12px] py-[13px] text-[13px] font-semibold text-navy-deep"
						>Approval Engine</td
					>
					<td class="px-[12px] py-[13px]"><Badge tone="ok">Operasional</Badge></td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">24 ms</td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">0 error</td
					>
				</tr>
				<tr class="border-b border-border last:border-0">
					<td class="px-[12px] py-[13px] text-[13px] font-semibold text-navy-deep"
						>Booking & Vendor Gateway</td
					>
					<td class="px-[12px] py-[13px]"><Badge tone="ok">Operasional</Badge></td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">118 ms</td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">2 retry</td
					>
				</tr>
				<tr class="border-b border-border last:border-0">
					<td class="px-[12px] py-[13px] text-[13px] font-semibold text-navy-deep"
						>Finance & Settlement</td
					>
					<td class="px-[12px] py-[13px]"><Badge tone="ok">Operasional</Badge></td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">31 ms</td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">0 error</td
					>
				</tr>
				<tr>
					<td class="px-[12px] py-[13px] text-[13px] font-semibold text-navy-deep"
						>Integrasi Direktorat & Notifikasi</td
					>
					<td class="px-[12px] py-[13px]"><Badge tone="pend">Koneksi email normal</Badge></td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">45 ms</td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground">1 info</td>
				</tr>
			</Table>
		</div>
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Administrasi</p>
		<div class="grid gap-2.5">
			<a
				href="/superadmin/master-data"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Database size={16} /></span
				> Master Data
			</a>
			<a
				href="/superadmin/pengguna"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Users size={16} /></span
				> User & Role
			</a>
			<a
				href="/superadmin/travel-policy"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ShieldCheck size={16} /></span
				>
				Travel Policy
				<span class="ml-auto text-[11.5px] font-medium text-muted-subtle"
					>{policies.length} grade</span
				>
			</a>
			<a
				href="/superadmin/workflow"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><GitBranch size={16} /></span
				> Workflow & Approval
			</a>
			<a
				href="/superadmin/integrasi"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><Plug size={16} /></span
				> Integrasi
			</a>
			<a
				href="/superadmin/audit-log"
				class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5 text-[13px] font-semibold text-navy-deep transition-colors hover:border-ring"
			>
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ScrollText size={16} /></span
				> Audit Log
			</a>
		</div>

		<div class="mt-4 rounded-2xl bg-gradient-to-br from-[#eef4f8] to-[#f7fafc] px-4 py-4">
			<p class="text-[12px] font-semibold tracking-[0.05em] text-muted-subtle uppercase">
				Limit per Policy
			</p>
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				value="0.74"
				class="mt-2 w-full accent-secondary"
				disabled
			/>
			<p class="mt-1 text-[12px] text-muted-subtle">
				Penggunaan limit tertinggi {rupiah(15000000)} (grade Direktur) — 74%
			</p>
		</div>
	</Card>
</div>
