<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Database } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import { onMount } from 'svelte';
	import { departments, kategori, proyeks, destinasi, be, loadMasters, tambahMaster } from '$lib/state.svelte';

	let tab = $state<'departemen' | 'kategori' | 'proyek' | 'destinasi'>('departemen');
	let addName = $state('');
	onMount(loadMasters);

	const TABS = [
		{ key: 'departemen', label: 'Departemen' },
		{ key: 'kategori', label: 'Kategori Biaya' },
		{ key: 'proyek', label: 'Proyek' },
		{ key: 'destinasi', label: 'Destinasi' }
	] as const;

	async function tambah() {
		if (!addName.trim()) return toast.error('Nama wajib diisi');
		const nama = addName.trim();
		if (!be.live) {
			// fallback lokal lama bila BE mati
			if (tab === 'departemen')
				departments.push({
					id: Math.max(0, ...departments.map((d) => d.id)) + 1,
					nama,
					count: 0
				});
			if (tab === 'kategori')
				kategori.push({
					id: Math.max(0, ...kategori.map((k) => k.id)) + 1,
					nama,
					deskripsi: '—'
				});
			if (tab === 'proyek')
				proyeks.push({
					id: Math.max(0, ...proyeks.map((p) => p.id)) + 1,
					nama,
					kode: `PRJ-2026-${String(proyeks.length + 1).padStart(3, '0')}`
				});
			if (tab === 'destinasi')
				destinasi.push({
					id: Math.max(0, ...destinasi.map((d) => d.id)) + 1,
					nama,
					kota: '—',
					negara: 'Indonesia'
				});
			toast.success(`${nama} ditambahkan lokal (BE mati)`);
			addName = '';
			return;
		}
		try {
			await tambahMaster(tab, nama);
			toast.success(`${nama} ditambahkan ke ${TABS.find((t) => t.key === tab)?.label}`);
		} catch (e: unknown) {
			toast.error((e as { message?: string })?.message ?? 'Gagal tambah');
		}
		addName = '';
	}
</script>

<svelte:head><title>Master Data — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Administrasi"
	title="Master Data"
	desc="Referensi departemen, kategori biaya, proyek, dan destinasi perusahaan."
/>

<div class="mt-5 flex flex-wrap items-center gap-2">
	{#each TABS as t (t.key)}
		<button
			onclick={() => (tab = t.key)}
			class="rounded-sm px-3 py-1.5 text-body-sm font-semibold transition-colors {tab === t.key
				? 'bg-navy-deep text-[#f5efeb]'
				: 'border border-border bg-card text-primary hover:bg-muted'}"
		>
			{t.label}
		</button>
	{/each}
</div>

<div class="mt-4 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
	<Card class="self-start">
		<p class="mb-4 font-heading text-heading font-medium text-navy-deep">Tambah Data</p>
		<Input
			label={TABS.find((t) => t.key === tab)?.label}
			bind:value={addName}
			placeholder={`Nama ${TABS.find((t) => t.key === tab)?.label.toLowerCase()}`}
		/>
		<div class="mt-3 flex justify-end">
			<Button onclick={tambah}><Database size={15} /> Tambahkan</Button>
		</div>
	</Card>

	<Card padding="none">
		{#if tab === 'departemen'}
			<Table headers={[{ label: 'Nama Departemen' }, { label: 'Jumlah Anggota', align: 'right' }]}>
				{#each departments as d (d.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-body-sm font-semibold text-navy-deep">{d.nama}</td>
						<td class="px-[12px] py-[13px] text-right text-body-sm text-muted-foreground"
							>{d.count} orang</td
						>
					</tr>
				{/each}
			</Table>
		{:else if tab === 'kategori'}
			<Table headers={[{ label: 'Kategori' }, { label: 'Deskripsi' }]}>
				{#each kategori as k (k.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-body-sm font-semibold text-navy-deep">{k.nama}</td>
						<td class="px-[12px] py-[13px] text-body-sm text-muted-foreground">{k.deskripsi}</td>
					</tr>
				{/each}
			</Table>
		{:else if tab === 'proyek'}
			<Table headers={[{ label: 'Proyek' }, { label: 'Kode' }]}>
				{#each proyeks as p (p.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-body-sm font-semibold text-navy-deep">{p.nama}</td>
						<td class="px-[12px] py-[13px]"
							><code class="rounded-xs bg-muted px-2 py-1 text-meta font-medium text-primary"
								>{p.kode}</code
							></td
						>
					</tr>
				{/each}
			</Table>
		{:else}
			<Table headers={[{ label: 'Destinasi' }, { label: 'Kota' }, { label: 'Negara' }]}>
				{#each destinasi as d (d.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[13px] text-body-sm font-semibold text-navy-deep">{d.nama}</td>
						<td class="px-[12px] py-[13px] text-body-sm text-muted-foreground">{d.kota}</td>
						<td class="px-[12px] py-[13px] text-body-sm text-muted-foreground">{d.negara}</td>
					</tr>
				{/each}
			</Table>
		{/if}
	</Card>
</div>
