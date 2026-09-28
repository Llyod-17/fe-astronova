<script lang="ts">
	import { page } from '$app/state';
	import { ROLE_MENUS } from '$lib/config/nav';
	import { cn } from '$lib/utils';
	import { session, switchRole } from '$lib/state.svelte';
	import { initials } from '$lib/format';
	import type { Role } from '$lib/types';
	import { X } from 'lucide-svelte';

	let {
		mobileOpen = false,
		onMobileClose = () => {}
	}: { mobileOpen?: boolean; onMobileClose?: () => void } = $props();

	const ROLES: { key: Role; label: string }[] = [
		{ key: 'karyawan', label: 'Karyawan' },
		{ key: 'atasan', label: 'Atasan' },
		{ key: 'admin-travel', label: 'Admin Travel' },
		{ key: 'finance', label: 'Finance' },
		{ key: 'superadmin', label: 'Super Admin' }
	];

	const pathname = $derived(page.url.pathname);
	const menus = $derived(ROLE_MENUS[session.role]);

	const isActive = $derived((href: string) =>
		href === pathname ? true : href !== '/' && pathname.startsWith(href)
	);
</script>

{#snippet navContent()}
	<nav class="flex flex-col gap-6">
		{#each menus as g (g.group)}
			<div>
				<p class="px-3 pb-2 text-label font-semibold text-muted-subtle uppercase">
					{g.group}
				</p>
				<ul class="flex flex-col">
					{#each g.items as item (item.href)}
						<li>
							<a
								href={item.href}
								aria-current={isActive(item.href) ? 'page' : undefined}
								class={cn(
									'-ml-px flex items-center gap-2.5 border-l-2 py-[7px] pr-3 pl-[10px] text-body-sm transition-colors',
									isActive(item.href)
										? 'border-l-navy-deep font-semibold text-navy-deep'
										: 'border-l-transparent font-medium text-muted-foreground hover:border-l-border-strong hover:text-navy-deep'
								)}
							>
								<item.icon size={15} class="shrink-0" />
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
{/snippet}

{#snippet brand()}
	<div class="flex items-center gap-3 px-3">
		<img src="/logo.jpg" alt="Astronova" class="h-10 w-10 rounded-sm object-cover" />
		<div>
			<p class="font-heading text-heading font-medium text-navy-deep">Astronova</p>
			<p class="mt-0.5 text-label font-semibold tracking-caps text-muted-subtle uppercase">
				Travel Management
			</p>
		</div>
	</div>
{/snippet}

{#snippet footer()}
	<div class="mt-auto space-y-3 border-t border-border px-3 pt-4">
		<div class="flex items-center gap-2.5">
			<div
				class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-deep text-label font-semibold text-canvas"
			>
				{initials(session.user.nama)}
			</div>
			<div class="min-w-0">
				<p class="truncate text-body-sm font-semibold text-navy-deep">{session.user.nama}</p>
				<p class="truncate text-meta text-muted-subtle">{session.user.jabatan}</p>
			</div>
		</div>
		<label class="block">
			<span class="text-label font-semibold text-muted-subtle uppercase">Lihat sebagai</span>
			<select
				value={session.role}
				onchange={(e) => switchRole(e.currentTarget.value as Role)}
				class="mt-1.5 w-full cursor-pointer rounded-sm border border-input bg-surface-input px-2 py-1.5 text-meta text-navy-deep transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
			>
				{#each ROLES as r (r.key)}
					<option value={r.key}>{r.label}</option>
				{/each}
			</select>
		</label>
	</div>
{/snippet}

<!-- Desktop sidebar -->
<aside
	class="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col gap-7 border-r border-border bg-sidebar px-4 py-6 lg:flex"
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
			class="absolute inset-y-0 left-0 flex w-[300px] flex-col gap-7 bg-sidebar px-4 py-6 shadow-raised"
		>
			<div class="flex items-center justify-between">
				{@render brand()}
				<button
					onclick={onMobileClose}
					class="rounded-xs p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-navy-deep"
					aria-label="Tutup menu"
				>
					<X size={16} />
				</button>
			</div>
			{@render navContent()}
			{@render footer()}
		</div>
	</div>
{/if}
