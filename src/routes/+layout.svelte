<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/app/sidebar.svelte';
	import Hero from '$lib/components/app/hero.svelte';
	import NotificationBell from '$lib/components/app/notification-bell.svelte';
	import { Menu } from 'lucide-svelte';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();

	import { page } from '$app/state';
	const BARE = ['/login', '/register'];
	const bare = $derived(BARE.some((p) => page.url.pathname.startsWith(p)));

	let menuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href="/logo.jpg" />
	<title>Astronova — Travel Management</title>
</svelte:head>

{#if bare}
	<!-- Auth pages render bare, full-bleed (login/register). Favicon + fonts stay global. -->
	{@render children()}
{:else}
	<div class="min-h-screen bg-canvas font-sans text-foreground">
		<Sidebar mobileOpen={menuOpen} onMobileClose={() => (menuOpen = false)} />

		<div class="lg:pl-[260px]">
			<div
				class="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden"
			>
				<div class="flex items-center gap-3">
					<button
						onclick={() => (menuOpen = true)}
						class="grid h-9 w-9 place-items-center rounded-sm border border-border bg-card text-navy-deep"
						aria-label="Buka menu"
					>
						<Menu size={17} />
					</button>
					<div class="flex items-center gap-2">
						<img src="/logo.jpg" alt="Astronova" class="h-9 w-9 rounded-sm object-cover" />
						<p class="font-heading text-heading-sm font-medium text-navy-deep">Astronova</p>
					</div>
				</div>
				<NotificationBell />
			</div>

			<main class="px-4 pt-5 pb-12 sm:px-6 lg:px-[42px] lg:pt-[34px] lg:pb-[60px]">
				<Hero />
				<div class="mt-[32px]">{@render children()}</div>
			</main>
		</div>
	</div>
{/if}

<Toaster position="top-right" richColors />
