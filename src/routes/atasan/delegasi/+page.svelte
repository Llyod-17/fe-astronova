<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { UserCog, Clock } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { DELEGASI_ACTIVE, USERS } from '$lib/data/mock';

	let delegasi = $state({ ...DELEGASI_ACTIVE });
	let enable = $state(true);

	function simpan() {
		toast.success(enable ? 'Delegasi aktif' : 'Delegasi dinonaktifkan', {
			description: enable
				? `${delegasi.dari} → ${delegasi.kepada} hingga ${delegasi.sampai_tgl}.`
				: 'Persetujuan kembali ke atasan langsung.'
		});
	}
</script>

<svelte:head><title>Delegasi — Astronova</title></svelte:head>

<PageHeader
	supertitle="Atasan / Persetujuan"
	title="Delegasi Persetujuan"
	desc="Limpahkan wewenang persetujuan ke kolega ketika berhalangan."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.2fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-[18px] font-medium text-navy-deep">Pengaturan Delegasi</p>
		<div class="grid gap-4">
			<div>
				<p class="mb-1.5 text-[12.5px] font-semibold text-navy-deep">Wakil Persetujuan</p>
				<div class="grid grid-cols-2 gap-2">
					{#each USERS.filter((u) => u.id === 3 || u.id === 2) as u (u.id)}
						<button
							type="button"
							onclick={() => (delegasi.kepada = u.nama)}
							class="rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition-colors {delegasi.kepada ===
							u.nama
								? 'border-ring bg-accent text-navy-deep'
								: 'border-border bg-surface-input text-muted-foreground hover:border-ring'}"
						>
							{u.nama}
							<span class="block text-[10.5px] font-medium text-muted-subtle">{u.jabatan}</span>
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
				class="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-input px-4 py-3"
			>
				<input type="checkbox" bind:checked={enable} class="h-4 w-4 accent-secondary" />
				<span class="text-[12.5px] font-medium text-navy-deep">Aktifkan delegasi approval</span>
			</label>
			<Button onclick={simpan}><UserCog size={15} /> Simpan Delegasi</Button>
		</div>
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Status Saat Ini</p>
		<div
			class="flex items-start gap-4 rounded-2xl border border-border bg-gradient-to-br from-[#eef4f8] to-[#f7fafc] p-5"
		>
			<span
				class="grid h-11 w-11 shrink-0 place-items-center rounded-[1rem] bg-navy-deep text-[#f5efeb]"
			>
				<Clock size={19} />
			</span>
			<div class="min-w-0">
				<p class="text-[13px] font-semibold text-navy-deep">
					{delegasi.dari} <span class="text-muted-subtle">→</span>
					{delegasi.kepada}
				</p>
				<p class="mt-0.5 text-[12.5px] text-muted-foreground">
					{delegasi.alasan} · berlaku {delegasi.dari_tgl} s.d. {delegasi.sampai_tgl}
				</p>
				<p class="mt-2 text-[12px] font-medium">
					<span
						class="rounded-full px-2.5 py-1 {enable
							? 'bg-ok-bg text-ok-fg'
							: 'bg-muted text-muted-subtle'}"
					>
						{enable ? 'Aktif' : 'Nonaktif'}
					</span>
				</p>
			</div>
		</div>
		<p class="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
			Ketika delegasi aktif, notifikasi pengajuan akan diteruskan ke {delegasi.kepada} dan keputusan atasnya
			tercatat atas nama Anda dalam audit log.
		</p>
	</Card>
</div>
