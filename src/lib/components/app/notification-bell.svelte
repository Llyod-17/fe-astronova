<script lang="ts">
	import { cn } from '$lib/utils';
	import { markAllRead, notifications, unreadCount } from '$lib/state.svelte';
	import { Bell, Check } from 'lucide-svelte';

	let open = $state(false);

	const unread = $derived(unreadCount());

	function toggle() {
		open = !open;
	}

	function markAll() {
		markAllRead();
	}
</script>

<div class="relative">
	<button
		onclick={toggle}
		class="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-navy-deep shadow-softer transition-colors hover:bg-muted"
		aria-label="Notifikasi"
	>
		<Bell size={17} />
		{#if unread > 0}
			<span
				class="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-alert-dot px-1 text-[9.5px] font-bold text-white ring-2 ring-navy-deep"
			>
				{unread}
			</span>
		{/if}
	</button>

	{#if open}
		<div class="fixed inset-0 z-40" onclick={toggle} role="presentation"></div>
		<div
			class="absolute right-0 z-50 mt-2 w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[20px] border border-border bg-card shadow-topbar"
		>
			<div class="flex items-center justify-between border-b border-border px-5 py-3.5">
				<p class="text-[12.5px] font-semibold text-navy-deep">Notifikasi</p>
				<button
					onclick={markAll}
					class="inline-flex items-center gap-1 text-[11.5px] font-semibold text-secondary hover:underline"
				>
					<Check size={12} /> Tandai semua dibaca
				</button>
			</div>
			<div class="max-h-[380px] overflow-y-auto">
				{#each notifications as n (n.id)}
					<div
						class={cn(
							'flex gap-3 border-b border-border px-5 py-3.5 transition-colors hover:bg-muted/40',
							!n.dibaca && 'bg-pend-bg/30'
						)}
					>
						<span
							class={cn(
								'mt-1.5 h-2 w-2 shrink-0 rounded-full',
								n.dibaca ? 'bg-muted-subtle/40' : 'bg-alert-dot ring-2 ring-white'
							)}
						></span>
						<div class="min-w-0">
							<p class="text-[12.5px] font-semibold text-navy-deep">{n.judul}</p>
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
		</div>
	{/if}
</div>
