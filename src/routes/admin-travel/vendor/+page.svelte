<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Building2 } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Sel from '$lib/components/ui/select.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { addVendor, vendors } from '$lib/state.svelte';
	import { z } from 'zod';

	const schema = z.object({
		nama: z.string().trim().min(2, 'Nama vendor wajib diisi'),
		kategori: z.string().min(1, 'Pilih kategori'),
		kontak: z.string().trim().email('Format email tidak valid'),
		rating: z.coerce.number().min(0).max(5, 'Rating 0–5')
	});
	type F = z.infer<typeof schema>;
	let f: F = $state({ nama: '', kategori: '', kontak: '', rating: 4 });
	let errors = $state<Record<string, string>>({});

	function submit() {
		const r = schema.safeParse(f);
		if (!r.success) {
			const e: Record<string, string> = {};
			for (const i of r.error.issues)
				if (i.path[0] && !e[String(i.path[0])]) e[String(i.path[0])] = i.message;
			errors = e;
			return;
		}
		addVendor(f);
		toast.success(`Vendor ${f.nama} ditambahkan`, {
			description: 'Masuk daftar partner travel resmi.'
		});
		f = { nama: '', kategori: '', kontak: '', rating: 4 };
		errors = {};
	}
</script>

<svelte:head><title>Vendor Travel — Astronova</title></svelte:head>

<PageHeader
	supertitle="Admin Travel / Operasional"
	title="Vendor Travel"
	desc="Direktori maskapai, hotel, dan transportasi lokal mitra Astronova."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-[18px] font-medium text-navy-deep">Tambah Vendor</p>
		<form
			class="grid gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<div>
				<Input label="Nama Vendor" bind:value={f.nama} placeholder="Cth: Singapore Airlines" />
				{#if errors.nama}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.nama}
					</p>{/if}
			</div>
			<div>
				<Sel label="Kategori" bind:value={f.kategori}>
					<option value="">Pilih kategori…</option>
					<option value="Maskapai">Maskapai</option>
					<option value="Hotel">Hotel</option>
					<option value="Agen Tiket">Agen Tiket</option>
					<option value="Transportasi Lokal">Transportasi Lokal</option>
				</Sel>
				{#if errors.kategori}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.kategori}
					</p>{/if}
			</div>
			<div>
				<Input label="Kontak (Email)" bind:value={f.kontak} placeholder="cs@vendor.co.id" />
				{#if errors.kontak}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.kontak}
					</p>{/if}
			</div>
			<div>
				<Input label="Rating Awal" type="number" min="0" max="5" step="0.1" bind:value={f.rating} />
				{#if errors.rating}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.rating}
					</p>{/if}
			</div>
			<div class="flex justify-end">
				<Button type="submit"><Building2 size={15} /> Simpan Vendor</Button>
			</div>
		</form>
	</Card>

	<Card padding="none">
		<Table
			headers={[
				{ label: 'Nama' },
				{ label: 'Kategori' },
				{ label: 'Kontak' },
				{ label: 'Rating', align: 'right' }
			]}
		>
			{#each vendors as v (v.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[13px] font-semibold text-navy-deep">{v.nama}</td>
					<td class="px-[12px] py-[13px]"><Badge tone="neutral">{v.kategori}</Badge></td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{v.kontak}</td>
					<td class="px-[12px] py-[13px] text-right">
						<span class="text-[12.5px] font-semibold text-navy-deep">★ {v.rating.toFixed(1)}</span>
					</td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
