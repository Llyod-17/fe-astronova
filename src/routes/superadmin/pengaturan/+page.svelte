<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Settings } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';

	let cfg = $state({
		notifikasiEmail: true,
		notifikasiPush: false,
		autoDelegasi: true,
		laporanHarian: false,
		modeKetatLimit: true
	});

	function simpan() {
		toast.success('Pengaturan disimpan', { description: 'Preferensi sistem diperbarui (demo).' });
	}
	const OPTIONS: {
		key: 'notifikasiEmail' | 'notifikasiPush' | 'autoDelegasi' | 'laporanHarian' | 'modeKetatLimit';
		label: string;
		desc: string;
	}[] = [
		{
			key: 'notifikasiEmail',
			label: 'Notifikasi Email',
			desc: 'Kirim email ke karyawan & atasan pada setiap perubahan status.'
		},
		{
			key: 'notifikasiPush',
			label: 'Notifikasi Push',
			desc: 'Berlaku untuk aplikasi mobile (belum aktif).'
		},
		{
			key: 'autoDelegasi',
			label: 'Delegasi Otomatis',
			desc: 'Teruskan approval saat atasan off lebih dari 3 hari.'
		},
		{
			key: 'laporanHarian',
			label: 'Rekap Harian Finance',
			desc: 'Ringkasan pencairan & klaim dikirim tiap sore.'
		},
		{
			key: 'modeKetatLimit',
			label: 'Mode Ketat Limit',
			desc: 'Tolak pengajuan yang melampaui limit policy tanpa approval level 2.'
		}
	];
</script>

<svelte:head><title>Pengaturan — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Sistem"
	title="Pengaturan"
	desc="Preferensi global notifikasi, keamanan, dan perilaku sistem."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-2">
	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Preferensi Sistem</p>
		<div class="grid gap-2.5">
			{#each OPTIONS as item (item.key)}
				<label
					class="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface-input px-4 py-3.5"
				>
					<input
						type="checkbox"
						checked={cfg[item.key]}
						onchange={() => (cfg[item.key] = !cfg[item.key])}
						class="mt-0.5 h-4 w-4 accent-secondary"
					/>
					<span>
						<span class="block text-[13px] font-semibold text-navy-deep">{item.label}</span>
						<span class="block text-[12px] text-muted-foreground">{item.desc}</span>
					</span>
				</label>
			{/each}
		</div>
		<div class="mt-4 flex justify-end">
			<Button onclick={simpan}><Settings size={15} /> Simpan Pengaturan</Button>
		</div>
	</Card>

	<Card class="self-start">
		<p class="mb-3 font-heading text-[18px] font-medium text-navy-deep">Versi Sistem</p>
		<div class="grid gap-2 text-[12.5px] text-muted-foreground">
			<div class="flex justify-between border-b border-border pb-2">
				<span>Platform</span><span class="font-semibold text-navy-deep">Astronova Travel</span>
			</div>
			<div class="flex justify-between border-b border-border pb-2">
				<span>Versi</span><span class="font-semibold text-navy-deep">v2.6.1</span>
			</div>
			<div class="flex justify-between border-b border-border pb-2">
				<span>Rilis Terakhir</span><span class="font-semibold text-navy-deep">Sep 2026</span>
			</div>
			<div class="flex justify-between">
				<span>Mode</span><span class="font-semibold text-navy-deep">Prototype (mock data)</span>
			</div>
		</div>
		<div class="mt-4 rounded-2xl bg-muted/60 px-4 py-3 text-[12px] text-muted-subtle">
			Rilis ini adalah pratinjau antarmuka. Integrasi backend sesuai spesifikasi API Direktorat
			belum diaktifkan.
		</div>
	</Card>
</div>
