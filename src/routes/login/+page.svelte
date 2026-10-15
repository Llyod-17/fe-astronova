<script lang="ts">
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Lock, LogIn, Mail, Plane, ShieldCheck } from 'lucide-svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { doLogin } from '$lib/state.svelte';
	import type { Role } from '$lib/types';

	let email = $state('');
	let password = $state('');
	let showPw = $state(false);
	let loading = $state(false);
	let error = $state('');

	const HOME: Record<Role, string> = {
		karyawan: '/',
		atasan: '/atasan',
		'admin-travel': '/admin-travel',
		finance: '/finance',
		superadmin: '/superadmin'
	};

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (loading) return;
		error = '';
		loading = true;
		try {
			const role = await doLogin(email.trim(), password);
			goto(HOME[role] ?? '/');
		} catch (err) {
			const m = (err as { message?: string; errors?: Record<string, string[]> })?.message;
			error = m || 'Login gagal. Cek email & password.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Login — Astronova</title></svelte:head>

<section class="grid min-h-screen place-items-center bg-canvas px-4 py-10 font-sans">
	<div
		class="w-full max-w-[1060px] overflow-hidden rounded-[28px] border border-border bg-card shadow-raised"
	>
		<div class="grid lg:grid-cols-[1fr_1.05fr]">
			<!-- LEFT : hero banner -->
			<div
				class="relative flex flex-col justify-between overflow-hidden px-8 py-12 sm:px-12 lg:min-h-[640px] lg:p-[40px]"
				style="background: linear-gradient(135deg, #3a5068, #1e2937 75%); box-shadow: 0 30px 60px -30px rgba(30,41,55,.6);"
			>
				<div
					class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-25 blur-2xl"
					style="background: linear-gradient(135deg, #c8d9e6, #7196a5);"
				></div>

				<div class="relative flex items-center gap-3">
					<img src="/logo.jpg" alt="Astronova" class="h-11 w-11 rounded-full object-cover" />
					<div>
						<p class="text-label font-semibold tracking-display text-[#9daeba] uppercase">
							Astronova
						</p>
						<p class="text-meta text-[#c9d3da]">Technology in Harmony</p>
					</div>
					<span
						class="ml-auto rounded-full border border-white/20 px-3 py-1 text-meta font-semibold text-[#c9d3da]"
						>Corporate Travel</span
					>
				</div>

				<div class="relative mt-12 lg:mt-0">
					<p class="text-label font-semibold tracking-display text-[#9daeba] uppercase">
						Executive Voyage
					</p>
					<h1 class="mt-4 font-heading text-display-lg font-medium text-[#f5efeb]">
						Perjalanan dinas, tenang & terorganisir.
					</h1>
					<p class="mt-4 max-w-[38ch] text-body text-[#c9d3da]">
						Pengajuan, approval, booking, uang muka, hingga reimbursement — satu alur
						concierge dalam genggaman.
					</p>

					<div class="mt-8 flex flex-wrap gap-2">
						<span
							class="rounded-full px-4 py-2 text-meta font-semibold text-white"
							style="background: linear-gradient(150deg, #7196a5, #567c8d); box-shadow: 0 14px 26px -14px rgba(86,124,141,.65);"
							><span class="mr-1.5 inline-flex align-[-2px]"><Plane size={13} /></span>12 trip aktif</span
						>
						<span
							class="rounded-full border border-white/20 px-4 py-2 text-meta font-semibold text-[#f5efeb]"
							>Approval &lt; 1 hari</span
						>
						<span
							class="rounded-full border border-white/20 px-4 py-2 text-meta font-semibold text-[#f5efeb]"
							>Audit-ready</span
						>
					</div>
				</div>

				<div class="relative mt-12 flex items-center gap-3 lg:mt-0">
					<span class="h-px w-12 bg-white/25"></span>
					<span class="h-1.5 w-1.5 rounded-full bg-teal-light"></span>
					<span class="h-px w-12 bg-white/25"></span>
					<p class="ml-2 text-meta text-[#8fa0ac]">Marine blues · warm linen · editorial serif</p>
				</div>
			</div>

			<!-- RIGHT : form -->
			<div class="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-[52px] lg:py-14">
				<div class="w-full max-w-[400px]">
					<p class="text-label font-semibold tracking-display text-muted-subtle uppercase">
						Selamat Datang
					</p>
					<h2 class="mt-3 font-heading text-display font-medium text-navy-deep">Login</h2>
					<p class="mt-2 text-body-sm text-muted-foreground">
						Masuk untuk lanjut mengelola perjalanan Anda.
					</p>

					<form onsubmit={submit} class="mt-8 space-y-5">
						<div>
							<Input
								label="Email"
								bind:value={email}
								type="email"
								autocomplete="email"
								placeholder="nama@astronova.co.id"
								class="pl-10"
							/>
							<div class="pointer-events-none relative">
								<Mail
									size={16}
									class="absolute -top-[34px] left-3.5 text-muted-subtle"
								/>
							</div>
						</div>

						<div>
							<div class="flex items-center justify-between">
								<span class="mb-1.5 block text-label font-semibold text-muted-subtle uppercase"
									>Password</span
								>
								<span class="mb-1.5 text-meta text-muted-subtle">Lupa password?</span>
							</div>
							<div class="relative">
								<Lock
									size={16}
									class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-subtle"
								/>
								<Input
									bind:value={password}
									type={showPw ? 'text' : 'password'}
									autocomplete="current-password"
									placeholder="Masukkan password"
									class="pr-11 pl-10"
								/>
								<button
									type="button"
									onclick={() => (showPw = !showPw)}
									class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-subtle transition-colors hover:text-navy-deep"
									aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
								>
									{#if showPw}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
								</button>
							</div>
						</div>

						{#if error}
							<p
								class="rounded-[10px] border border-danger/30 bg-danger/5 px-3 py-2 text-meta text-danger"
							>
								{error}
							</p>
						{/if}

						<button
							type="submit"
							disabled={loading}
							class="flex w-full items-center justify-center gap-2 rounded-full px-[22px] py-3 text-body-sm font-semibold text-white transition-all active:translate-y-px disabled:opacity-60"
							style="background: linear-gradient(150deg, #7196a5, #567c8d); box-shadow: 0 14px 26px -14px rgba(86,124,141,.65);"
						>
							<LogIn size={16} />
							{loading ? 'Memproses…' : 'Login'}
						</button>

						<div class="flex items-center gap-2 pt-1">
							<ShieldCheck size={14} class="text-muted-subtle" />
							<p class="text-meta text-muted-subtle">Data kamu aman & terenkripsi.</p>
						</div>
					</form>

					<p class="mt-8 border-t border-border pt-6 text-center text-meta text-muted-subtle">
						Belum punya akun? <span class="font-semibold text-secondary">Hubungi admin Travel.</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
