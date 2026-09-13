<script lang="ts">
	import { Check, Inbox } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { notifications, markAllRead } from '$lib/state.svelte';
	import { cn } from '$lib/utils';
</script>

<svelte:head><title>Notifikasi — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Pusat Notifikasi"
	title="Notifikasi"
	desc="Semua aktivitas terkait pengajuan, booking, dan keuangan Anda."
>
	{#snippet actions()}
		<Button variant="outline" onclick={markAllRead}><Check size={14} /> Tandai semua dibaca</Button>
	{/snippet}
</PageHeader>

<div class="mt-5 max-w-3xl">
	<Card padding="none">
		<ul class="divide-y divide-border">
			{#each notifications as n (n.id)}
				<li
					class={cn(
						'flex gap-4 px-6 py-5 transition-colors hover:bg-muted/40',
						!n.dibaca && 'bg-pend-bg/30'
					)}
				>
					<span
						class={cn(
							'mt-2 h-2.5 w-2.5 shrink-0 rounded-full',
							n.dibaca ? 'bg-muted-subtle/40' : 'bg-alert-dot'
						)}
					></span>
					<div class="min-w-0 flex-1">
						<p class="text-[13.5px] font-semibold text-navy-deep">{n.judul}</p>
						<p class="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{n.isidata}</p>
						<p class="mt-1 text-[11px] font-medium tracking-[0.04em] text-muted-subtle uppercase">
							{n.waktu}
						</p>
					</div>
				</li>
			{/each}
		</ul>
		{#if notifications.length === 0}
			<div class="flex flex-col items-center gap-2 px-6 py-14 text-muted-subtle">
				<Inbox size={22} />
				<p class="text-[13px] font-medium">Tidak ada notifikasi</p>
			</div>
		{/if}
	</Card>
</div>
