<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/app/sidebar.svelte';
	import Hero from '$lib/components/app/hero.svelte';
	import NotificationBell from '$lib/components/app/notification-bell.svelte';
	import { Plane, Menu } from 'lucide-svelte';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
	let menuOpen = $state(false);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-canvas font-sans text-foreground">
	<Sidebar mobileOpen={menuOpen} onMobileClose={() => (menuOpen = false)} />

	<div class="lg:pl-[260px]">
		<div
			class="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden"
		>
			<div class="flex items-center gap-3">
				<button
					onclick={() => (menuOpen = true)}
					class="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-navy-deep"
					aria-label="Buka menu"
				>
					<Menu size={18} />
				</button>
				<div class="flex items-center gap-2">
					<div class="grid h-8 w-8 place-items-center rounded-[0.9rem] bg-navy-deep text-[#f5efeb]">
						<Plane size={15} />
					</div>
					<p class="font-heading text-[17px] font-medium text-navy-deep">Astronova</p>
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

<Toaster position="top-right" richColors />
