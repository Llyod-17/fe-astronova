<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { UserCog } from 'lucide-svelte';
	import PageHeader from '$lib/components/app/page-header.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Sel from '$lib/components/ui/select.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import { USERS } from '$lib/data/mock';
	import { initials } from '$lib/format';
	import { z } from 'zod';
	import type { Role } from '$lib/types';

	const schema = z.object({
		nama: z.string().trim().min(3, 'Nama minimal 3 karakter'),
		email: z.string().trim().email('Email tidak valid'),
		jabatan: z.string().trim().min(3, 'Jabatan wajib diisi'),
		peran: z.enum(['karyawan', 'atasan', 'admin-travel', 'finance', 'superadmin'])
	});
	type F = z.infer<typeof schema>;
	let f: F = $state({ nama: '', email: '', jabatan: '', peran: 'karyawan' });
	let errors = $state<Record<string, string>>({});

	const roleLabel: Record<Role, string> = {
		karyawan: 'Karyawan',
		atasan: 'Atasan',
		'admin-travel': 'Admin Travel',
		finance: 'Finance',
		superadmin: 'Super Admin'
	};

	function submit() {
		const r = schema.safeParse(f);
		if (!r.success) {
			const e: Record<string, string> = {};
			for (const i of r.error.issues)
				if (i.path[0] && !e[String(i.path[0])]) e[String(i.path[0])] = i.message;
			errors = e;
			return;
		}
		toast.success(`User ${f.nama} dibuat`, {
			description: `Role: ${roleLabel[f.peran]}. Undangan email terkirim (demo).`
		});
		f = { nama: '', email: '', jabatan: '', peran: 'karyawan' };
		errors = {};
	}
</script>

<svelte:head><title>User & Role — Astronova</title></svelte:head>

<PageHeader
	supertitle="Super Admin / Administrasi"
	title="User & Role"
	desc="Kelola akun pengguna dan penempatan peran di sistem Astronova."
/>

<div class="mt-5 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
	<Card class="self-start">
		<p class="mb-5 font-heading text-[18px] font-medium text-navy-deep">Buat Pengguna</p>
		<form
			class="grid gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
		>
			<div>
				<Input label="Nama Lengkap" bind:value={f.nama} placeholder="Cth: Andi Pratama" />
				{#if errors.nama}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.nama}
					</p>{/if}
			</div>
			<div>
				<Input label="Email" bind:value={f.email} placeholder="nama@astronova.id" />
				{#if errors.email}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.email}
					</p>{/if}
			</div>
			<div>
				<Input label="Jabatan" bind:value={f.jabatan} placeholder="Cth: Staff Finance" />
				{#if errors.jabatan}<p class="mt-1.5 text-[12px] font-medium text-destructive">
						{errors.jabatan}
					</p>{/if}
			</div>
			<div>
				<Sel label="Peran" bind:value={f.peran}>
					{#each Object.entries(roleLabel) as [key, label] (key)}
						<option value={key}>{label}</option>
					{/each}
				</Sel>
			</div>
			<div class="flex justify-end">
				<Button type="submit"><UserCog size={15} /> Buat Pengguna</Button>
			</div>
		</form>
	</Card>

	<Card padding="none">
		<Table
			headers={[
				{ label: 'Pengguna' },
				{ label: 'NIK', align: 'right' },
				{ label: 'Jabatan' },
				{ label: 'Peran' }
			]}
		>
			{#each USERS as u (u.id)}
				<tr class="border-b border-border last:border-0 hover:bg-muted/40">
					<td class="px-[12px] py-[13px]">
						<div class="flex items-center gap-2.5">
							<span
								class="grid h-8 w-8 place-items-center rounded-full bg-accent text-[10.5px] font-bold text-accent-foreground"
								>{initials(u.nama)}</span
							>
							<div>
								<p class="text-[13px] font-semibold text-navy-deep">{u.nama}</p>
								<p class="text-[11.5px] text-muted-subtle">{u.email}</p>
							</div>
						</div>
					</td>
					<td class="px-[12px] py-[13px] text-right text-[12px] text-muted-foreground">{u.nik}</td>
					<td class="px-[12px] py-[13px] text-[12.5px] text-muted-foreground">{u.jabatan}</td>
					<td class="px-[12px] py-[13px]"
						><Badge tone={u.peran === 'superadmin' ? 'sky' : 'neutral'}
							>{roleLabel[u.peran as Role]}</Badge
						></td
					>
				</tr>
			{/each}
		</Table>
	</Card>
</div>
