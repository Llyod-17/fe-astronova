<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ArrowDown, ArrowUp } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { itinerary, reorderItinerary, trips } from '$lib/state.svelte';
	import type { ItineraryItem } from '$lib/types';

	let tripId = $state('TRIP-2026-001');
	const okTrips = $derived(
		trips.filter((t) => t.status === 'disetujui' || t.status === 'berlangsung')
	);
	const items = $derived(itinerary.filter((i) => i.tripId === tripId));

	function setTrip(e: Event) {
		tripId = (e.currentTarget as HTMLSelectElement).value;
	}

	function move(idx: number, dir: -1 | 1) {
		const list = [...items];
		const target = idx + dir;
		if (target < 0 || target >= list.length) return;
		[list[idx], list[target]] = [list[target], list[idx]];
		reorderItinerary(tripId, list);
		toast.info('Urutan itinerary diperbarui');
	}

	function tambah() {
		const waktu = (document.getElementById('it-waktu') as HTMLInputElement | null)?.value ?? '';
		const aktivitas =
			(document.getElementById('it-aktivitas') as HTMLInputElement | null)?.value ?? '';
		const lokasi = (document.getElementById('it-lokasi') as HTMLInputElement | null)?.value ?? '';
		if (!aktivitas.trim()) return toast.error('Aktivitas wajib diisi');
		const it: ItineraryItem = { id: `ITN-${Date.now()}`, tripId, waktu, aktivitas, lokasi };
		itinerary.push(it);
		toast.success('Item itinerary ditambahkan');
		(document.getElementById('it-aktivitas') as HTMLInputElement | null)!.value = '';
	}
</script>

<svelte:head><title>Itinerary — Astronova</title></svelte:head>

<PageHeader
	supertitle="Admin Travel / Operasional"
	title="Susun Itinerary"
	desc="Urutkan agenda perjalanan harian untuk setiap karyawan."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
	<Card class="self-start">
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Pilih Perjalanan</p>
		<select
			onchange={setTrip}
			class="w-full rounded-xl border border-input bg-surface-input px-[14px] py-[11px] text-[13px] text-navy-deep focus:border-ring focus:ring-2 focus:ring-ring/40 focus:outline-none"
		>
			{#each okTrips as t (t.id)}
				<option value={t.id} selected={t.id === tripId}>{t.id} — {t.kota}</option>
			{/each}
		</select>

		<p class="mt-6 mb-2 font-heading text-[16px] font-medium text-navy-deep">Tambah Agenda</p>
		<div class="grid gap-3">
			<Input id="it-waktu" placeholder="Waktu — Cth: 20 Sep 09:00" />
			<Input id="it-aktivitas" placeholder="Aktivitas" />
			<Input id="it-lokasi" placeholder="Lokasi" />
			<Button variant="navy" onclick={tambah}>Tambahkan</Button>
		</div>
	</Card>

	<Card>
		<div class="mb-4 flex items-center justify-between">
			<p class="font-heading text-[18px] font-medium text-navy-deep">Itinerary {tripId}</p>
			<span
				class="rounded-full bg-accent px-3 py-1 text-[11.5px] font-semibold text-accent-foreground"
				>{items.length} item</span
			>
		</div>
		<ol class="grid gap-2">
			{#each items as it, idx (it.id)}
				<li class="bg-surface flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
					<span
						class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-deep text-[12px] font-bold text-[#f5efeb]"
					>
						{idx + 1}
					</span>
					<div class="min-w-0 flex-1">
						<p class="text-[13px] font-semibold text-navy-deep">{it.aktivitas}</p>
						<p class="text-[11.5px] text-muted-subtle">
							{it.waktu}{it.lokasi ? ` · ${it.lokasi}` : ''}
						</p>
					</div>
					<div class="flex gap-1">
						<Button size="sm" variant="ghost" onclick={() => move(idx, -1)} aria-label="Naik"
							><ArrowUp size={14} /></Button
						>
						<Button size="sm" variant="ghost" onclick={() => move(idx, 1)} aria-label="Turun"
							><ArrowDown size={14} /></Button
						>
					</div>
				</li>
			{/each}
		</ol>
		{#if items.length === 0}
			<p class="py-8 text-center text-[13px] text-muted-subtle">
				Belum ada agenda untuk perjalanan ini.
			</p>
		{/if}
	</Card>
</div>
