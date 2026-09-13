<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Plug } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';

	const apis = [
		{
			nama: 'Direktorat Pengajuan Perjalanan',
			status: 'Aktif',
			versi: 'v1.0',
			desc: 'Menyimpan & menarik data pengajuan karyawan secara real-time'
		},
		{
			nama: 'Direktorat Pengeluaran & Reimbursement',
			status: 'Aktif',
			versi: 'v1.0',
			desc: 'Pengajuan klaim dan bukti struk otomatis'
		},
		{
			nama: 'Direktorat Riwayat Persetujuan',
			status: 'Aktif',
			versi: 'v1.0',
			desc: 'Audit trail persetujuan atasan & delegasi'
		},
		{
			nama: 'Integrasi Email Notifikasi',
			status: 'Aktif',
			versi: '—',
			desc: 'Pengiriman email notifikasi ke karyawan & atasan'
		},
		{
			nama: 'Integrasi Excel & PDF Export',
			status: 'Aktif',
			versi: '—',
			desc: 'Ekspor data laporan dan pengajuan ke format dokumen'
		},
		{
			nama: 'Integrasi Log Audit Sentral',
			status: 'Draft',
			versi: 'v0.3',
			desc: 'Pencatatan seluruh aksi sistem ke log terpusat'
		}
	];

	function ujiApi(nama: string) {
		toast.success(`${nama}`, { description: 'Koneksi berhasil — response 200 OK (demo).' });
	}
</script>

<svelte:head><title>Integrasi — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Sistem"
	title="Integrasi"
	desc="Status koneksi layanan eksternal: Direktorat Pengajuan, Email, dan modul pendukung."
/>

<div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
	{#each apis as a, i (i)}
		<Card>
			<div class="flex items-start justify-between gap-2">
				<div class="flex items-center gap-3">
					<span
						class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
						><Plug size={16} /></span
					>
					<p class="font-heading text-[14.5px] leading-snug font-medium text-navy-deep">{a.nama}</p>
				</div>
				<Badge tone={a.status === 'Aktif' ? 'ok' : 'pend'}>{a.status}</Badge>
			</div>
			<p class="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{a.desc}</p>
			<div class="mt-4 flex items-center justify-between">
				<span class="text-[11.5px] text-muted-subtle"
					>{a.versi !== '—' ? `Versi ${a.versi}` : 'Tanpa versi'}</span
				>
				<Button size="sm" variant="outline" onclick={() => ujiApi(a.nama)}>Uji Koneksi</Button>
			</div>
		</Card>
	{/each}
</div>

<div
	class="mt-4 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-[12.5px] text-muted-foreground"
>
	Semua request ke Direktorat terenkripsi TLS 1.2+. Log request disimpan di audit log untuk
	kepatuhan.
</div>
