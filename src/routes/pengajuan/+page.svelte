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
	import { addTrip, proyeks, destinasi, trips, be, loadMasters, loadTrips, kirimPengajuanBE, uploadDokumenBE } from '$lib/state.svelte';
	import { dateId, todayIso } from '$lib/format';
	import { Plane, Paperclip } from 'lucide-svelte';
	import { onMount } from 'svelte';
	onMount(async () => {
		await loadMasters();
		await loadTrips();
	});

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
	let fileList = $state<File[]>([]);

	function onFilesSelected(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			fileList = Array.from(target.files);
		}
	}

	function onDestinasiChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const val = target.value;
		const found = destinasi.find((d) => d.nama === val || d.kota === val);
		if (found) {
			f.tujuan = found.nama;
			f.kota = found.kota;
		}
	}

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

	async function submit() {
		if (!validate()) {
			toast.error('Periksa kembali form pengajuan', {
				description: 'Beberapa field wajib belum terisi dengan benar.'
			});
			return;
		}
		if (!be.live) {
			const t = addTrip({ ...f, karyawanId: 1 });
			toast.success(`Pengajuan ${t.id} terkirim (lokal, BE mati)`);
		} else {
			try {
				const saved = await kirimPengajuanBE({ ...f });
				const rawId = (saved as any)?.data?.id_pengajuan ?? (saved as any)?.id_pengajuan ?? (trips[0] as any)?._raw?.id_pengajuan;
				if (fileList.length && rawId) {
					for (const fl of fileList) {
						await uploadDokumenBE(fl, rawId, 'surat_tugas').catch(() => {});
					}
				}
				toast.success('Pengajuan terkirim ke server');
			} catch (e: unknown) {
				toast.error((e as { message?: string })?.message ?? 'Gagal kirim', {
					description: JSON.stringify((e as { errors?: unknown })?.errors ?? '')
				});
				return;
			}
		}
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
		fileList = [];
		const inp = document.getElementById('dok-be') as HTMLInputElement | null;
		if (inp) inp.value = '';
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
		<p class="mb-5 font-heading text-heading font-medium text-navy-deep">Form Pengajuan Baru</p>
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
				{#if errOf('tujuan')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('tujuan')}
					</p>{/if}
			</div>
			<div>
				<Sel label="Kota Tujuan" bind:value={f.kota} onchange={onDestinasiChange}>
					<option value="">Pilih kota tujuan…</option>
					{#each destinasi as d (d.id)}
						<option value={d.kota}>{d.kota} ({d.nama})</option>
					{/each}
				</Sel>
				{#if errOf('kota')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('kota')}
					</p>{/if}
			</div>
			<div>
				<Input label="Tanggal Berangkat" type="date" bind:value={f.berangkat} />
				{#if errOf('berangkat')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('berangkat')}
					</p>{/if}
			</div>
			<div>
				<Input label="Tanggal Kembali" type="date" bind:value={f.kembali} />
				{#if errOf('kembali')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('kembali')}
					</p>{/if}
			</div>
			<div class="sm:col-span-2">
				<Input
					label="Keperluan / Tujuan Perjalanan"
					bind:value={f.keperluan}
					placeholder="Jelaskan keperluan perjalanan dinas"
				/>
				{#if errOf('keperluan')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('keperluan')}
					</p>{/if}
			</div>
			<div class="sm:col-span-2">
				<Sel label="Proyek Terkait" bind:value={f.proyek}>
					<option value="">Pilih proyek…</option>
					{#each proyeks as p (p.id)}
						<option value={p.nama}>{p.nama} ({p.kode})</option>
					{/each}
				</Sel>
				{#if errOf('proyek')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('proyek')}
					</p>{/if}
			</div>
			<div>
				<Input label="Estimasi Biaya (Rp)" type="number" min="0" bind:value={f.anggaran} />
				{#if errOf('anggaran')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('anggaran')}
					</p>{/if}
			</div>
			<div>
				<Input label="Uang Muka (Rp)" type="number" min="0" bind:value={f.uangMuka} />
				{#if errOf('uangMuka')}<p class="mt-1.5 text-meta font-medium text-destructive">
						{errOf('uangMuka')}
					</p>{/if}
			</div>
			<div class="sm:col-span-2">
				<p class="mb-1.5 block text-body-sm font-semibold text-navy-deep">Dokumen Pendukung (Surat Tugas / Itinerary)</p>
				<input
					id="dok-be"
					type="file"
					multiple
					accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
					onchange={onFilesSelected}
					class="w-full rounded-sm border border-input bg-surface-input px-3 py-2 text-body-sm text-foreground file:mr-3 file:rounded-xs file:border-0 file:bg-primary file:px-3 file:py-1 file:text-meta file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
				/>
				{#if fileList.length > 0}
					<ul class="mt-2 flex flex-wrap gap-2">
						{#each fileList as fl (fl.name)}
							<li
								class="rounded-xs bg-accent px-3 py-1.5 text-meta font-semibold text-accent-foreground"
							>
								{fl.name} ({(fl.size / 1024).toFixed(1)} KB)
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
							description: 'Pengajuan tersimpan sebagai draft.'
						})}
				>
					Simpan Draft
				</Button>
				<Button type="submit"><Plane size={15} /> Ajukan Pengajuan</Button>
			</div>
		</form>
	</Card>

	<Card>
		<p class="mb-4 font-heading text-heading font-medium text-navy-deep">Riwayat Pengajuan</p>
		<Table headers={[{ label: 'Rute' }, { label: 'Tanggal' }, { label: 'Status' }]}>
			{#each trips as t (t.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[12px]"><RouteCell from="CGK" to={t.kota} /></td>
					<td class="px-[12px] py-[12px] text-body-sm text-muted-foreground"
						>{dateId(t.berangkat)}</td
					>
					<td class="px-[12px] py-[12px]"><StatusBadge status={t.status} /></td>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
