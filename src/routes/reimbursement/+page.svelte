<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ReceiptText } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Sel from '$lib/components/ui/select.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import { ajukanReimbursement, kategori, reimbursements, trips, be, loadMasters, loadTrips, loadReimbursements, ajukanGantiBE } from '$lib/state.svelte';
	import { rupiah } from '$lib/format';
	import { z } from 'zod';
	import { onMount } from 'svelte';
	onMount(async () => {
		await loadMasters();
		await loadTrips();
		await loadReimbursements();
	});

	const schema = z.object({
		tripId: z.string().min(1, 'Pilih perjalanan'),
		kategori: z.string().min(1, 'Pilih kategori'),
		deskripsi: z.string().trim().min(3, 'Deskripsi minimal 3 karakter'),
		jumlah: z.coerce.number().positive('Nominal wajib lebih dari 0')
	});
	type F = z.infer<typeof schema>;
	let f: F = $state({ tripId: '', kategori: '', deskripsi: '', jumlah: 0 });
	let errors = $state<Record<string, string>>({});
	let bukti = $state<File | null>(null);

	function onFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			bukti = target.files[0];
		}
	}

	const tripsFin = $derived(
		trips.filter(
			(t) => t.status === 'selesai' || t.status === 'berlangsung' || t.status === 'disetujui'
		)
	);

	async function submit() {
		const r = schema.safeParse(f);
		if (!r.success) {
			const e: Record<string, string> = {};
			for (const i of r.error.issues)
				if (i.path[0] && !e[String(i.path[0])]) e[String(i.path[0])] = i.message;
			errors = e;
			return;
		}
		if (!bukti) {
			toast.error('Pilih file struk sebelum mengajukan reimbursement');
			return;
		}

		if (!be.live) {
			toast.error('Backend tidak aktif. Reimbursement real tidak dapat disimpan.');
			return;
		}

		try {
			await ajukanGantiBE({ ...f, bukti });
			f = { tripId: '', kategori: '', deskripsi: '', jumlah: 0 };
			bukti = null;
			errors = {};
			const input = document.querySelector<HTMLInputElement>('input[type="file"]');
			if (input) input.value = '';
		} catch (e: unknown) {
			toast.error((e as { message?: string })?.message ?? 'Gagal mengajukan reimbursement');
		}
	}
</script>

<svelte:head><title>Reimbursement — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Keuangan"
	title="Pengajuan Reimbursement"
	desc="Klaim biaya pribadi yang dikeluarkan selama perjalanan dinas, lengkap dengan bukti."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-heading font-medium text-navy-deep">Klaim Biaya</p>
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
					{#each tripsFin as t (t.id)}
						<option value={t.id}>{t.id} — {t.kota}</option>
					{/each}
				</Sel>
				{#if errors.tripId}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errors.tripId}
					</p>{/if}
			</div>
			<div>
				<Sel label="Kategori Biaya" bind:value={f.kategori}>
					<option value="">Pilih kategori…</option>
					{#each kategori as k (k.id)}
						<option value={k.nama}>{k.nama} — {k.deskripsi}</option>
					{/each}
				</Sel>
				{#if errors.kategori}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errors.kategori}
					</p>{/if}
			</div>
			<div>
				<Input
					label="Deskripsi"
					bind:value={f.deskripsi}
					placeholder="Cth: Taksi dari bandara ke hotel"
				/>
				{#if errors.deskripsi}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errors.deskripsi}
					</p>{/if}
			</div>
			<div>
				<Input
					label="Nominal (Rp)"
					type="number"
					min="0"
					bind:value={f.jumlah}
					placeholder="Cth: 150000"
				/>
				{#if errors.jumlah}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errors.jumlah}
					</p>{/if}
			</div>
			<div>
				<p class="mb-1.5 block text-body-sm font-semibold text-navy-deep">Bukti Pembayaran (File Struk / Nota)</p>
				<input
					type="file"
					accept="image/jpeg,image/png,image/jpg,application/pdf"
					onchange={onFileChange}
					class="w-full rounded-sm border border-input bg-surface-input px-3 py-2 text-body-sm text-foreground file:mr-3 file:rounded-xs file:border-0 file:bg-primary file:px-3 file:py-1 file:text-meta file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
				/>
				{#if bukti}
					<p class="mt-1 text-meta font-medium text-emerald-600">Terpilih: {bukti.name} ({(bukti.size / 1024).toFixed(1)} KB)</p>
				{/if}
			</div>
			<div class="flex justify-end">
				<Button type="submit"><ReceiptText size={15} /> Ajukan Klaim</Button>
			</div>
		</form>
	</Card>

	<Card padding="none">
		<Table
			headers={[
				{ label: 'ID' },
				{ label: 'Trip' },
				{ label: 'Kategori' },
				{ label: 'Deskripsi' },
				{ label: 'Jumlah', align: 'right' },
				{ label: 'Status' }
			]}
		>
			{#each reimbursements as r (r.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px] text-body-sm font-semibold text-primary">{r.id}</td>
					<td class="px-[12px] py-[13px] text-body-sm text-muted-foreground">{r.tripId}</td>
					<td class="px-[12px] py-[13px] text-body-sm text-muted-foreground">{r.kategori}</td>
					<td class="max-w-[220px] truncate px-[12px] py-[13px] text-body-sm text-muted-foreground"
						>{r.deskripsi}</td
					>
					<td class="px-[12px] py-[13px] text-right text-body-sm font-semibold text-navy-deep"
						>{rupiah(r.jumlah)}</td
					>
					<td class="px-[12px] py-[13px]"><StatusBadge status={r.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
