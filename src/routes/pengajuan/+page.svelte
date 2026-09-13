<script lang="ts">
	import { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Sel from '$lib/components/ui/select.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import StatusBadge from '$lib/components/app/status-badge.svelte';
	import RouteCell from '$lib/components/app/route-cell.svelte';
	import { addTrip, proyeks, trips } from '$lib/state.svelte';
	import { dateId, todayIso } from '$lib/format';
	import { Plane, Paperclip } from 'lucide-svelte';

	const schema = z
		.object({
			tujuan: z.string().trim().min(3, 'Tujuan wajib diisi'),
			kota: z.string().trim().min(2, 'Kota tujuan wajib diisi'),
			berangkat: z.string().min(1, 'Tanggal berangkat wajib diisi'),
			kembali: z.string().min(1, 'Tanggal kembali wajib diisi'),
			keperluan: z.string().trim().min(5, 'Jelaskan keperluan perjalanan'),
			anggaran: z.coerce.number().positive('Estimasi biaya wajib lebih dari 0'),
			uangMuka: z.coerce.number().min(0),
			proyek: z.string().min(1, 'Pilih proyek')
		})
		.refine((v) => !v.berangkat || !v.kembali || v.kembali >= v.berangkat, {
			message: 'Tanggal kembali harus setelah tanggal berangkat',
			path: ['kembali']
		});

	type F = z.infer<typeof schema>;
	let f: F = $state({
		tujuan: '',
		kota: '',
		berangkat: todayIso(),
		kembali: todayIso(),
		keperluan: '',
		anggaran: 0,
		uangMuka: 0,
		proyek: ''
	});
	let errors = $state<Record<string, string>>({});
	let files = $state<string[]>([]);

	function validate(): boolean {
		const r = schema.safeParse(f);
		if (!r.success) {
			const e: Record<string, string> = {};
			for (const issue of r.error.issues)
				if (issue.path[0] && !e[String(issue.path[0])]) e[String(issue.path[0])] = issue.message;
			errors = e;
			return false;
		}
		errors = {};
		return true;
	}

	function errOf(key: string): string {
		return errors[key] ?? '';
	}

	function submit() {
		if (!validate()) {
			toast.error('Periksa kembali form pengajuan', {
				description: 'Beberapa field wajib belum terisi dengan benar.'
			});
			return;
		}
		const t = addTrip({ ...f, karyawanId: 1 });
		toast.success(`Pengajuan ${t.id} terkirim`, {
			description: 'Pengajuan diteruskan ke atasan untuk persetujuan.'
		});
		f = {
			tujuan: '',
			kota: '',
			berangkat: todayIso(),
			kembali: todayIso(),
			keperluan: '',
			anggaran: 0,
			uangMuka: 0,
			proyek: ''
		};
		files = [];
	}

	function addFile() {
		const three = ['surat_tugas.pdf', 'brosur_budget.pdf', 'itinerary_draft.xlsx'];
		files = [...files, three[files.length % three.length]];
	}
</script>

<svelte:head><title>Pengajuan Perjalanan — Astronova</title></svelte:head>

<PageHeader
	supertitle="Karyawan / Pengajuan"
	title="Pengajuan Perjalanan Dinas"
	desc="Isi data perjalanan dan estimasi anggaran. Sistem akan mengarahkan pengajuan ke atasan langsung Anda untuk disposisi."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
	<Card>
		<p class="mb-5 font-heading text-[18px] font-medium text-navy-deep">Form Pengajuan Baru</p>
		<form
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
			class="grid gap-4 sm:grid-cols-2"
		>
			<div>
				<Input
					label="Tujuan Perjalanan"
					bind:value={f.tujuan}
					placeholder="Cth: Kantor Cabang Surabaya"
				/>
				{#if errOf('tujuan')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('tujuan')}
					</p>{/if}
			</div>
			<div>
				<Input label="Kota Tujuan" bind:value={f.kota} placeholder="Cth: Surabaya" />
				{#if errOf('kota')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('kota')}
					</p>{/if}
			</div>
			<div>
				<Input label="Tanggal Berangkat" type="date" bind:value={f.berangkat} />
				{#if errOf('berangkat')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('berangkat')}
					</p>{/if}
			</div>
			<div>
				<Input label="Tanggal Kembali" type="date" bind:value={f.kembali} />
				{#if errOf('kembali')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('kembali')}
					</p>{/if}
			</div>
			<div class="sm:col-span-2">
				<Input
					label="Keperluan / Tujuan Perjalanan"
					bind:value={f.keperluan}
					placeholder="Jelaskan keperluan perjalanan dinas"
				/>
				{#if errOf('keperluan')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('keperluan')}
					</p>{/if}
			</div>
			<div>
				<Sel label="Proyek" bind:value={f.proyek}>
					<option value="">Pilih proyek…</option>
					{#each proyeks as p (p.id)}
						<option value={p.nama}>{p.nama} ({p.kode})</option>
					{/each}
				</Sel>
				{#if errOf('proyek')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('proyek')}
					</p>{/if}
			</div>
			<div>
				<Input label="Estimasi Biaya (Rp)" type="number" min="0" bind:value={f.anggaran} />
				{#if errOf('anggaran')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('anggaran')}
					</p>{/if}
			</div>
			<div>
				<Input label="Uang Muka (Rp)" type="number" min="0" bind:value={f.uangMuka} />
				{#if errOf('uangMuka')}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errOf('uangMuka')}
					</p>{/if}
			</div>
			<div class="sm:col-span-2">
				<p class="mb-1.5 block text-[12.5px] font-semibold text-navy-deep">Dokumen Pendukung</p>
				<button
					type="button"
					onclick={addFile}
					class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-surface-input px-4 py-9 text-[12.5px] font-medium text-muted-subtle transition-colors hover:border-ring hover:text-secondary"
				>
					<Paperclip size={15} /> Klik untuk melampirkan dokumen
				</button>
				{#if files.length > 0}
					<ul class="mt-2 flex flex-wrap gap-2">
						{#each files as fl (fl)}
							<li
								class="rounded-full bg-accent px-3 py-1.5 text-[11.5px] font-semibold text-accent-foreground"
							>
								{fl}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
			<div class="flex items-center justify-end gap-2 sm:col-span-2">
				<Button
					variant="outline"
					type="button"
					onclick={() =>
						toast.info('Draft disimpan', {
							description: 'Pengajuan tersimpan sebagai draft. (demo)'
						})}
				>
					Simpan Draft
				</Button>
				<Button type="submit"><Plane size={15} /> Ajukan Pengajuan</Button>
			</div>
		</form>
	</Card>

	<Card>
		<p class="mb-4 font-heading text-[18px] font-medium text-navy-deep">Riwayat Pengajuan</p>
		<Table headers={[{ label: 'Rute' }, { label: 'Tanggal' }, { label: 'Status' }]}>
			{#each trips as t (t.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[12px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[12px] text-[12.5px] text-muted-foreground"
						>{dateId(t.berangkat)}</td
					>
					<td class="px-[12px] py-[12px]"><StatusBadge status={t.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
