<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { GitBranch, ArrowRight } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';

	const chains = [
		{
			nama: 'Pengajuan ≤ Rp 10 Jt',
			steps: ['Karyawan', 'Atasan Langsung', 'Admin Travel', 'Finance']
		},
		{
			nama: 'Pengajuan > Rp 10 Jt',
			steps: ['Karyawan', 'Atasan Langsung', 'Level 2 (Divisi)', 'Admin Travel', 'Finance']
		},
		{ nama: 'Uang Muka / Reimbursement', steps: ['Karyawan', 'Atasan', 'Finance'] },
		{ nama: 'Settlement', steps: ['Karyawan', 'Finance', 'Kunci Perjalanan'] }
	];

	let aktif = $state<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });
	function toggle(i: number) {
		aktif[i] = !aktif[i];
	}

	function simpan(i: number) {
		toast.success(
			aktif[i] ? `Alur ${chains[i].nama} diaktifkan` : `Alur ${chains[i].nama} dinonaktifkan`,
			{
				description: 'Perubahan berlaku untuk pengajuan baru.'
			}
		);
	}
</script>

<svelte:head><title>Workflow & Approval — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Administrasi"
	title="Workflow & Approval"
	desc="Konfigurasi rantai persetujuan untuk setiap jenis dokumen perjalanan."
/>

<div class="mt-5 grid gap-5">
	{#each chains as c, i (i)}
		<Card>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-3">
					<span
						class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
						><GitBranch size={16} /></span
					>
					<p class="font-heading text-[16px] font-medium text-navy-deep">{c.nama}</p>
				</div>
				<div class="flex items-center gap-2">
					<label
						class="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-navy-deep"
					>
						<input
							type="checkbox"
							checked={aktif[i]}
							onchange={() => toggle(i)}
							class="h-4 w-4 accent-secondary"
						/>
						Aktif
					</label>
					<Button size="sm" variant="outline" onclick={() => simpan(i)}>Simpan</Button>
				</div>
			</div>
			<div class="mt-4 flex flex-wrap items-center gap-2">
				{#each c.steps as s, j (j)}
					<span
						class="bg-surface rounded-full border border-border px-4 py-2 text-[12.5px] font-semibold text-navy-deep"
						>{s}</span
					>
					{#if j < c.steps.length - 1}
						<ArrowRight size={14} class="text-muted-subtle" />
					{/if}
				{/each}
			</div>
		</Card>
	{/each}

	<div
		class="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-[12.5px] text-muted-foreground"
	>
		Level persetujuan tambahan otomatis aktif bila nominal melebihi limit policy grade. Delegasi
		approval menggantikan step atasan pada rentang tanggal tertentu.
	</div>
</div>
