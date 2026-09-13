<script lang="ts">
	import { page } from '$app/state';
	import { ROLE_MENUS } from '$lib/config/nav';
	import { cn } from '$lib/utils';
	import { session } from '$lib/state.svelte';
	import { initials } from '$lib/format';
	import { Plane, X } from 'lucide-svelte';

	let {
		mobileOpen = false,
		onMobileClose = () => {}
	}: { mobileOpen?: boolean; onMobileClose?: () => void } = $props();

	const pathname = $derived(page.url.pathname);
	const menus = $derived(ROLE_MENUS[session.role]);

	const isActive = $derived((href: string) =>
		href === pathname ? true : href !== '/' && pathname.startsWith(href)
	);
</script>

{#snippet navContent()}
	<div class="flex flex-col gap-6">
		{#each menus as g (g.group)}
			<div>
				<p
					class="px-[16px] pb-2 text-[10.5px] font-semibold tracking-[0.06em] text-muted-subtle uppercase"
				>
					{g.group}
				</p>
				<nav class="flex flex-col gap-1">
					{#each g.items as item (item.href)}
						<a
							href={item.href}
							class={cn(
								'flex items-center gap-2.5 rounded-full px-[16px] py-[9px] text-[13px] font-medium transition-all',
								isActive(item.href)
									? 'bg-secondary text-white shadow-btn-teal'
									: 'text-sidebar-foreground hover:bg-muted'
							)}
						>
							<item.icon
								size={16}
								class={isActive(item.href) ? 'text-white' : 'text-muted-foreground'}
							/>
							{item.label}
						</a>
					{/each}
				</nav>
			</div>
		{/each}
	</div>
{/snippet}

{#snippet brand()}
	<div class="flex items-center gap-3 px-[16px]">
		<div
			class="grid h-10 w-10 place-items-center rounded-[1.15rem] bg-navy-deep text-[#f5efeb] shadow-btn-navy"
		>
			<Plane size={18} />
		</div>
		<div>
			<p class="font-heading text-[19px] leading-none font-medium text-navy-deep">Astronova</p>
			<p class="mt-1 text-[10.5px] font-semibold tracking-[0.1em] text-muted-subtle uppercase">
				Travel Management
			</p>
		</div>
	</div>
{/snippet}

{#snippet footer()}
	<div class="mt-auto space-y-3 border-t border-border px-[16px] pt-4">
		<div class="flex items-center gap-2.5">
			<div
				class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground"
			>
				{initials('Admin Astronova')}
			</div>
			<div class="min-w-0">
				<p class="truncate text-[12.5px] font-semibold text-navy-deep">Astronova Admin</p>
				<p class="truncate text-[11px] text-muted-subtle">IT Operations</p>
			</div>
		</div>
	</div>
{/snippet}

<!-- Desktop sidebar -->
<aside
	class="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col gap-6 border-r border-border bg-sidebar px-[18px] py-6 lg:flex"
>
	{@render brand()}
	{@render navContent()}
	{@render footer()}
</aside>

<!-- Mobile drawer -->
{#if mobileOpen}
	<div class="fixed inset-0 z-50 lg:hidden">
		<div
			class="absolute inset-0 bg-navy-deep/40 backdrop-blur-[2px]"
			onclick={onMobileClose}
			role="presentation"
		></div>
		<div
			class="absolute inset-y-0 left-0 flex w-[300px] flex-col gap-6 bg-sidebar px-[18px] py-6 shadow-topbar"
		>
			<div class="flex items-center justify-between">
				{@render brand()}
				<button
					onclick={onMobileClose}
					class="rounded-full p-2 text-muted-foreground hover:bg-muted"
					aria-label="Tutup menu"
				>
					<X size={18} />
				</button>
			</div>
			{@render navContent()}
			{@render footer()}
		</div>
	</div>
{/if}
