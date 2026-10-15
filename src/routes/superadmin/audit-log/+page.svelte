<script lang="ts">
	import { ScrollText } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { AUDIT_LOG } from '$lib/data/mock';
	import { dateTimeId } from '$lib/format';
	import { auditLive, be, loadAuditLive } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	onMount(loadAuditLive);
	const rows = $derived(be.live && auditLive.rows.length ? auditLive.rows : AUDIT_LOG);
</script>

<svelte:head><title>Audit Log — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Sistem"
	title="Audit Log"
	desc="Catatan setiap perubahan data, persetujuan, dan pengaturan sistem untuk kepatuhan."
/>

<div class="mt-5">
	<Card padding="none">
		<div class="flex items-center gap-2 px-6 pt-5">
			<span
				class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
				><ScrollText size={16} /></span
			>
			<p class="font-heading text-heading-sm font-medium text-navy-deep">
				Log Aktivitas ({rows.length} entri){be.live ? ' — live BE' : ' — data contoh'}
			</p>
		</div>
		<div class="px-6 pt-4 pb-6">
			<Table
				headers={[
					{ label: 'Waktu' },
					{ label: 'Aktor' },
					{ label: 'Aksi' },
					{ label: 'Entitas' },
					{ label: 'IP' }
				]}
			>
				{#each rows as e (e.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-meta whitespace-nowrap text-muted-foreground"
							>{dateTimeId(e.waktu)}</td
						>
						<td class="px-[12px] py-[13px] text-body-sm font-medium text-navy-deep">{e.aktor}</td>
						<td class="px-[12px] py-[13px]">
							<Badge
								tone={e.aksi.includes('APPROVE') || e.aksi.includes('CREATE')
									? 'ok'
									: e.aksi.includes('UPDATE')
										? 'sky'
										: 'neutral'}
							>
								{e.aksi}
							</Badge>
						</td>
						<td class="px-[12px] py-[13px]"
							><code class="rounded-xs bg-muted px-2 py-1 text-label font-medium text-primary"
								>{e.entitas}</code
							></td
						>
						<td class="px-[12px] py-[13px] text-meta text-muted-subtle">{e.ip}</td>
					</tr>
				{/each}
			</Table>
		</div>
	</Card>
</div>
