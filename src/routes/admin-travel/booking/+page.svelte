<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Plane } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Sel from '$lib/components/ui/select.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { addBooking, bookings, trips, vendors } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';
	import { z } from 'zod';

	const schema = z.object({
		tripId: z.string().min(1, 'Pilih perjalanan'),
		jenis: z.string().min(1, 'Pilih jenis'),
		detail: z.string().trim().min(3, 'Detail pemesanan wajib diisi'),
		nomorRef: z.string().trim().min(2, 'Nomor referensi wajib diisi'),
		vendor: z.string().min(1, 'Pilih vendor'),
		harga: z.coerce.number().positive('Harga wajib lebih dari 0')
	});
	type F = z.infer<typeof schema>;
	let f: F = $state({ tripId: '', jenis: '', detail: '', nomorRef: '', vendor: '', harga: 0 });
	let errors = $state<Record<string, string>>({});

	const eligible = $derived(
		trips.filter((t) => t.status === 'disetujui' || t.status === 'berlangsung')
	);

	function submit() {
		const r = schema.safeParse(f);
		if (!r.success) {
			const e: Record<string, string> = {};
			for (const i of r.error.issues)
				if (i.path[0] && !e[String(i.path[0])]) e[String(i.path[0])] = i.message;
			errors = e;
			return;
		}
		const b = addBooking({
			tripId: f.tripId,
			jenis: f.jenis as 'Tiket Pesawat',
			detail: f.detail,
			nomorRef: f.nomorRef,
			vendor: f.vendor,
			harga: f.harga,
			status: 'pending'
		});
		toast.success(`Booking ${b.id} dibuat`, { description: 'Menunggu konfirmasi vendor.' });
		f = { tripId: '', jenis: '', detail: '', nomorRef: '', vendor: '', harga: 0 };
		errors = {};
	}
</script>

<svelte:head><title>Kelola Booking — Astronova</title></svelte:head>

<PageHeader
	supertitle="Admin Travel / Operasional"
	title="Kelola Booking"
	desc="Buat pesanan tiket, hotel, dan transportasi; konfirmasi status dari vendor."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.5fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-[18px] font-medium text-navy-deep">Booking Baru</p>
		<form
			class="grid gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<div>
				<Sel label="Perjalanan" bind:value={f.tripId}>
					<option value="">Pilih perjalanan…</option>
					{#each eligible as t (t.id)}
						<option value={t.id}>{t.id} — {t.kota} ({dateId(t.berangkat)})</option>
					{/each}
				</Sel>
				{#if errors.tripId}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.tripId}
					</p>{/if}
			</div>
			<div>
				<Sel label="Jenis" bind:value={f.jenis}>
					<option value="">Pilih jenis…</option>
					<option value="Tiket Pesawat">Tiket Pesawat</option>
					<option value="Kereta">Kereta</option>
					<option value="Hotel">Hotel</option>
					<option value="Transportasi">Transportasi</option>
				</Sel>
				{#if errors.jenis}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.jenis}
					</p>{/if}
			</div>
			<div>
				<Input
					label="Detail Pemesanan"
					bind:value={f.detail}
					placeholder="Cth: CGK → SUB — Garuda GA-312"
				/>
				{#if errors.detail}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.detail}
					</p>{/if}
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<Input label="Nomor Referensi" bind:value={f.nomorRef} placeholder="Cth: GA-29018" />
					{#if errors.nomorRef}<p class="mt-1.5 text-[12px] font-medium text-destructive">
							{errors.nomorRef}
						</p>{/if}
				</div>
				<div>
					<Sel label="Vendor" bind:value={f.vendor}>
						<option value="">Pilih vendor…</option>
						{#each vendors as v (v.id)}
							<option value={v.nama}>{v.nama}</option>
						{/each}
					</Sel>
					{#if errors.vendor}<p class="mt-1.5 text-[12px] font-medium text-destructive">
							{errors.vendor}
						</p>{/if}
				</div>
			</div>
			<div>
				<Input
					label="Harga (Rp)"
					type="number"
					min="0"
					bind:value={f.harga}
					placeholder="Cth: 1750000"
				/>
				{#if errors.harga}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.harga}
					</p>{/if}
			</div>
			<div class="flex justify-end">
				<Button type="submit"><Plane size={15} /> Buat Booking</Button>
			</div>
		</form>
	</Card>

	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Detail' },
				{ label: 'Ref' },
				{ label: 'Vendor' },
				{ label: 'Harga', align: 'right' },
				{ label: 'Status' }
			]}
		>
			{#each bookings as b (b.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{b.id}</td>
					<td class="px-[12px] py-[13px]">
						<p class="text-[12.5px] font-semibold text-navy-deep">{b.jenis}</p>
						<p class="text-[11.5px] text-muted-foreground">{b.detail}</p>
					</td>
					<td class="px-[12px] py-[13px] text-[11.5px] text-muted-foreground">{b.nomorRef}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{b.vendor}</td>
					<td
						class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep tabular-nums"
						>{rupiah(b.harga)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={b.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
