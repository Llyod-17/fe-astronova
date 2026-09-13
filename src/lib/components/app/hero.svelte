<script lang="ts">
	import { session, switchRole } from '$lib/state.svelte';
	import { cn } from '$lib/utils';
	import NotificationBell from './notification-bell.svelte';
	import { Search } from 'lucide-svelte';
	import type { Role } from '$lib/types';

	const ROLES: { key: Role; label: string }[] = [
		{ key: 'karyawan', label: 'Karyawan' },
		{ key: 'atasan', label: 'Atasan' },
		{ key: 'admin-travel', label: 'Admin Travel' },
		{ key: 'finance', label: 'Finance' },
		{ key: 'superadmin', label: 'Super Admin' }
	];

	const SUBTITLE: Record<Role, string> = {
		karyawan: 'Pantau pengajuan, booking, dan keuangan dinas Anda dalam satu tempat.',
		atasan: 'Percepat keputusan — persetujuan tim kini berjalan lebih ringkas.',
		'admin-travel': 'Proses booking dan susun itinerary untuk seluruh karyawan.',
		finance: 'Kendalikan pencairan, verifikasi, dan rekonsiliasi keuangan dinas.',
		superadmin: 'Jaga konfigurasi sistem, kebijakan, dan kesehatan seluruh modul.'
	};

	let query = $state('');
</script>

<section
	class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#3a5068] via-[#2c4156] to-navy-deep p-[28px_32px] shadow-topbar"
>
	<div
		class="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-40 -bottom-20 h-48 w-48 rounded-full bg-teal-light/10 blur-3xl"
	></div>

	<div class="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
		<div>
			<p class="text-[12px] font-semibold tracking-[0.08em] text-teal-light uppercase">
				{new Date().toLocaleDateString('id-ID', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})}
			</p>
			<h1 class="mt-2 font-heading text-[32px] leading-[1.15] font-medium text-white">
				Selamat pagi, {session.user.nama}
			</h1>
			<p class="mt-1 max-w-xl text-[13.5px] leading-relaxed text-[#c9d3da]">
				{SUBTITLE[session.role]}
			</p>
		</div>

		<div class="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
			<div
				class="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 focus-within:border-teal-light"
			>
				<Search size={15} class="text-[#c9d3da]" />
				<input
					bind:value={query}
					type="search"
					placeholder="Cari perjalanan, nomor dokumen…"
					class="w-44 bg-transparent text-[13px] text-white placeholder:text-[#8fa4b0] focus:outline-none"
				/>
			</div>
			<div class="flex items-center gap-2">
				<div class="rounded-full border border-white/15 bg-white/5 p-1">
					<NotificationBell />
				</div>
				<div class="flex flex-wrap gap-1.5 rounded-full border border-white/15 bg-white/5 p-1.5">
					{#each ROLES as r (r.key)}
						<button
							onclick={() => switchRole(r.key)}
							class={cn(
								'rounded-full px-[15px] py-[7px] text-[12px] font-semibold transition-all',
								session.role === r.key
									? 'bg-secondary text-white shadow-btn-teal'
									: 'text-[#c9d3da] hover:bg-white/10'
							)}
						>
							{r.label}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
