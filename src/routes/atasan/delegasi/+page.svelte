<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { UserCog, Clock } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { delegasiList, penggunaList, be, session, loadDelegasi, loadPengguna } from '$lib/state.svelte';
	import { create } from '$lib/api';
	import { onMount } from 'svelte';

	onMount(async () => {
		await loadPengguna();
		await loadDelegasi();
	});

	const activeDelegasi = $derived(delegasiList.find((d: any) => d.aktif) ?? null);

	let delegasi = $state({
		dari: session.user.nama || 'Atasan',
		kepada: '',
		id_penerima: null as number | null,
		dari_tgl: '',
		sampai_tgl: '',
		alasan: ''
	});
	let enable = $state(false);

	const kandidat = $derived(
		penggunaList.length > 0
			? penggunaList
					.filter((u: any) => u.id !== session.user.id)
					.map((u: any) => ({ id: u.id, nama: u.nama, jabatan: u.jabatan }))
					.slice(0, 4)
			: delegasiList.map((d: any) => ({ id: d.id, nama: d.kepada, jabatan: '' })).slice(0, 4)
	);

	async function simpan() {
		try {
			await create('delegasi', {
				id_penerima: delegasi.id_penerima ?? kandidat[0]?.id,
				dari_tgl: delegasi.dari_tgl,
				sampai_tgl: delegasi.sampai_tgl,
				alasan: delegasi.alasan,
				aktif: enable
			});
			await loadDelegasi();
			toast.success(enable ? 'Delegasi aktif' : 'Delegasi dinonaktifkan', {
				description: enable
					? `${delegasi.dari} → ${delegasi.kepada} hingga ${delegasi.sampai_tgl}.`
					: 'Persetujuan kembali ke atasan langsung.'
			});
		} catch (e: unknown) {
			toast.error((e as any)?.message ?? 'Gagal menyimpan delegasi ke server');
		}
	}

	const shown = $derived(activeDelegasi ?? delegasi);
	const isActive = $derived(activeDelegasi ? activeDelegasi.aktif : enable);
</script>

<svelte:head><title>Delegasi — Astronova</title></svelte:head>

<PageHeader
	supertitle="Atasan / Persetujuan"
	title="Delegasi Persetujuan"
	desc="Limpahkan wewenang persetujuan ke kolega ketika berhalangan."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.2fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-heading font-medium text-navy-deep">Pengaturan Delegasi</p>
		<div class="grid gap-4">
			<div>
				<p class="mb-1.5 text-body-sm font-semibold text-navy-deep">Wakil Persetujuan</p>
				<div class="grid grid-cols-2 gap-2">
					{#each kandidat as u (u.id)}
						<button
							type="button"
							onclick={() => {
								delegasi.kepada = u.nama;
								delegasi.id_penerima = u.id;
							}}
							class="rounded-sm border px-3 py-2.5 text-left text-body-sm font-semibold transition-colors {delegasi.kepada ===
							u.nama
								? 'border-ring bg-accent text-navy-deep'
								: 'border-border bg-surface-input text-muted-foreground hover:border-ring'}"
						>
							{u.nama}
							<span class="block text-label font-medium text-muted-subtle">{u.jabatan}</span>
						</button>
					{/each}
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<Input label="Dari Tanggal" type="date" bind:value={delegasi.dari_tgl} />
				<Input label="Sampai Tanggal" type="date" bind:value={delegasi.sampai_tgl} />
			</div>
			<div>
				<Input label="Alasan" bind:value={delegasi.alasan} placeholder="Cth: Cuti tahunan" />
			</div>
			<label
				class="flex cursor-pointer items-center gap-3 rounded-sm border border-border bg-surface-input px-4 py-3"
			>
				<input type="checkbox" bind:checked={enable} class="h-4 w-4 accent-secondary" />
				<span class="text-body-sm font-medium text-navy-deep">Aktifkan delegasi approval</span>
			</label>
			<Button onclick={simpan}><UserCog size={15} /> Simpan Delegasi</Button>
		</div>
	</Card>

	<Card>
		<p class="mb-4 font-heading text-heading font-medium text-navy-deep">Status Saat Ini</p>
		<div
			class="flex items-start gap-4 rounded-sm border border-border bg-gradient-to-br from-[#eef4f8] to-[#f7fafc] p-5"
		>
			<span
				class="grid h-11 w-11 shrink-0 place-items-center rounded-[1rem] bg-navy-deep text-[#f5efeb]"
			>
				<Clock size={19} />
			</span>
			<div class="min-w-0">
				<p class="text-body-sm font-semibold text-navy-deep">
					{shown.dari} <span class="text-muted-subtle">→</span>
					{shown.kepada}
				</p>
				<p class="mt-0.5 text-body-sm text-muted-foreground">
					{shown.alasan} · berlaku {shown.dari_tgl} s.d. {shown.sampai_tgl}
				</p>
				<p class="mt-2 text-meta font-medium">
					<span
						class="rounded-full px-2.5 py-1 {isActive
							? 'bg-ok-bg text-ok-fg'
							: 'bg-muted text-muted-subtle'}"
					>
						{isActive ? 'Aktif' : 'Nonaktif'}
					</span>
				</p>
			</div>
		</div>
		<p class="mt-4 text-body-sm leading-relaxed text-muted-foreground">
			Ketika delegasi aktif, notifikasi pengajuan akan diteruskan ke {delegasi.kepada} dan keputusan atasnya
			tercatat atas nama Anda dalam audit log.
		</p>
	</Card>
</div>
