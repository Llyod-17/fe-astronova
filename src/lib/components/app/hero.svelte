<script lang="ts">
	import { session } from '$lib/state.svelte';
	import NotificationBell from './notification-bell.svelte';
	import { Search } from 'lucide-svelte';
	import type { Role } from '$lib/types';

	const SUBTITLE: Record<Role, string> = {
		karyawan: 'Pantau pengajuan, booking, dan keuangan dinas Anda dalam satu tempat.',
		atasan: 'Percepat keputusan — persetujuan tim kini berjalan lebih ringkas.',
		'admin-travel': 'Proses booking dan susun itinerary untuk seluruh karyawan.',
		finance: 'Kendalikan pencairan, verifikasi, dan rekonsiliasi keuangan dinas.',
		superadmin: 'Jaga konfigurasi sistem, kebijakan, dan kesehatan seluruh modul.'
	};

	let query = $state('');
</script>

<section class="rounded-lg border border-white/10 bg-navy-deep px-8 py-7">
	<div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
		<div>
			<p class="text-label font-semibold text-teal-light uppercase">
				{new Date().toLocaleDateString('id-ID', {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})}
			</p>
			<h1 class="mt-2.5 font-heading text-display-lg font-medium text-white">
				Selamat pagi, {session.user.nama}
			</h1>
			<p class="mt-2 max-w-[54ch] text-body-sm text-[#b3c0ca]">
				{SUBTITLE[session.role]}
			</p>
		</div>

		<div class="flex items-center gap-3">
			<div
				class="flex items-center gap-2 rounded-sm border-b border-white/25 pb-2 focus-within:border-white"
			>
				<Search size={15} class="shrink-0 text-[#8fa4b0]" />
				<input
					bind:value={query}
					type="search"
					placeholder="Cari perjalanan, nomor dokumen…"
					aria-label="Cari"
					class="w-44 bg-transparent text-body-sm text-white placeholder:text-[#7c8f9b] focus:outline-none"
				/>
			</div>
			<NotificationBell />
		</div>
	</div>
</section>
