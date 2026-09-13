<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ShieldCheck } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { policies, updatePolicy } from '$lib/state.svelte';
	import { rupiah } from '$lib/format';
	import { z } from 'zod';

	let draft = $state('');
	let simpanKey = $state<number | null>(null);

	const schema = z.coerce.number().positive('Limit harus positif');

	function simpan(id: number) {
		const r = schema.safeParse(draft);
		if (!r.success)
			return toast.error('Limit tidak valid', { description: r.error.issues[0].message });
		updatePolicy(id, { limit: r.data });
		toast.success(`Policy ${id} diperbarui`, { description: `Limit kini ${rupiah(r.data)}.` });
		simpanKey = null;
		draft = '';
	}
</script>

<svelte:head><title>Travel Policy — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Administrasi"
	title="Travel Policy"
	desc="Aturan limit anggaran dan kelas perjalanan berdasarkan grade pegawai."
/>

<div class="mt-5">
	<Card padding="none">
		<div class="flex items-center justify-between px-6 pt-5">
			<div class="flex items-center gap-2">
				<span
					class="grid h-9 w-9 place-items-center rounded-[0.85rem] bg-accent text-accent-foreground"
					><ShieldCheck size={16} /></span
				>
				<p class="font-heading text-[16px] font-medium text-navy-deep">Limit per Grade</p>
			</div>
			<Badge tone="sky">Otomatis diberlakukan saat pengajuan</Badge>
		</div>
		<div class="px-6 pt-4 pb-6">
			<Table
				headers={[
					{ label: 'Latar Belakang' },
					{ label: 'Grade' },
					{ label: 'Limit', align: 'right' },
					{ label: 'Kelas' },
					{ label: 'Aksi', align: 'right' }
				]}
			>
				{#each policies as p (p.id)}
					<tr class="border-b border-border last:border-0 hover:bg-muted/40">
						<td class="px-[12px] py-[14px] text-[12.5px] text-muted-foreground"
							>{p.latarbelakang}</td
						>
						<td class="px-[12px] py-[14px] text-[13px] font-semibold text-navy-deep">{p.grade}</td>
						<td class="px-[12px] py-[14px] text-right">
							{#if simpanKey === p.id}
								<span class="inline-flex items-center gap-2">
									<Input
										type="number"
										min="0"
										class="w-32 text-right"
										value={draft}
										oninput={(e: Event) => (draft = (e.currentTarget as HTMLInputElement).value)}
										placeholder={String(p.limit)}
									/>
									<Button size="sm" onclick={() => simpan(p.id)}>Simpan</Button>
								</span>
							{:else}
								<span class="text-[13px] font-semibold text-navy-deep tabular-nums"
									>{rupiah(p.limit)}</span
								>
							{/if}
						</td>
						<td class="px-[12px] py-[14px] text-[12.5px] text-muted-foreground">{p.kelas}</td>
						<td class="px-[12px] py-[14px] text-right">
							<Button
								size="sm"
								variant="outline"
								onclick={() => (simpanKey = simpanKey === p.id ? null : p.id)}
							>
								{simpanKey === p.id ? 'Batal' : 'Ubah Limit'}
							</Button>
						</td>
					</tr>
				{/each}
			</Table>
		</div>
	</Card>

	<div class="mt-4 grid gap-4 text-[12.5px] text-muted-foreground sm:grid-cols-3">
		<div class="rounded-2xl border border-border bg-muted/40 px-4 py-3">
			<p class="font-semibold text-navy-deep">1. Atas approval</p>
			<p class="mt-0.5">Di atas limit memerlukan persetujuan level ke-2.</p>
		</div>
		<div class="rounded-2xl border border-border bg-muted/40 px-4 py-3">
			<p class="font-semibold text-navy-deep">2. Kelas perjalanan</p>
			<p class="mt-0.5">Kelas pesawat dibatasi sesuai grade.</p>
		</div>
		<div class="rounded-2xl border border-border bg-muted/40 px-4 py-3">
			<p class="font-semibold text-navy-deep">3. Auditor</p>
			<p class="mt-0.5">Perubahan policy tercatat di audit log.</p>
		</div>
	</div>
</div>
