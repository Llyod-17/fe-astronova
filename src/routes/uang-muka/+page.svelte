<script lang="ts">
	import { Wallet } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Sel from '$lib/components/ui/select.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { ajukanUangMuka, dana, trips, uangMukaTrip } from '$lib/state.svelte';
	import { dateId, rupiah } from '$lib/format';
	import { z } from 'zod';

	const schema = z.object({
		tripId: z.string().min(1, 'Pilih perjalanan'),
		jumlah: z.coerce.number().positive('Nominal wajib lebih dari 0')
	});
	type F = z.infer<typeof schema>;
	let f: F = $state({ tripId: '', jumlah: 0 });
	let errors = $state<Record<string, string>>({});

	const pilihable = $derived(
		trips.filter(
			(t) => (t.status === 'disetujui' || t.status === 'berlangsung') && uangMukaTrip(t.id) === 0
		)
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
		ajukanUangMuka(f.tripId, f.jumlah);
		f = { tripId: '', jumlah: 0 };
		errors = {};
	}
</script>

<svelte:head><title>Uang Muka — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Keuangan"
	title="Pengajuan Uang Muka (Cash Advance)"
	desc="Ajukan uang muka sebelum berangkat. Nilai maksimal mengikuti anggaran perjalanan & kebijakan perusahaan."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-[18px] font-medium text-navy-deep">Ajukan Uang Muka</p>
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
					{#each pilihable as t (t.id)}
						<option value={t.id}>{t.id} — {t.kota} ({dateId(t.berangkat)})</option>
					{/each}
				</Sel>
				{#if errors.tripId}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.tripId}
					</p>{/if}
			</div>
			<div>
				<Input
					label="Nominal (Rp)"
					type="number"
					min="0"
					bind:value={f.jumlah}
					placeholder="Cth: 3000000"
				/>
				{#if errors.jumlah}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.jumlah}
					</p>{/if}
			</div>
			<div class="flex justify-end">
				<Button type="submit"><Wallet size={15} /> Ajukan</Button>
			</div>
		</form>
	</Card>

	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Diajukan', align: 'right' },
				{ label: 'Dicairkan', align: 'right' },
				{ label: 'Tanggal' },
				{ label: 'Status' }
			]}
		>
			{#each dana as d (d.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-[12.5px] font-semibold text-primary">{d.id}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{d.tripId}</td>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] text-muted-foreground"
						>{rupiah(d.diajukan)}</td
					>
					<td class="px-[12px] py-[13px] text-right text-[12.5px] font-semibold text-navy-deep"
						>{d.disetujui > 0 ? rupiah(d.disetujui) : '—'}</td
					>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground"
						>{dateId(d.tanggal)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={d.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
