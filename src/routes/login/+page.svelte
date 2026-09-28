<script lang="ts">
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Lock, LogIn, ShieldCheck, UserRound } from 'lucide-svelte';

	let username = $state('');
	let password = $state('');
	let showPw = $state(false);
</script>

<svelte:head><title>Login — Astronova</title></svelte:head>

<section class="flex min-h-screen items-center justify-center bg-navy-deep px-4 py-10 font-sans">
	<div class="w-full max-w-[1060px] overflow-hidden rounded-lg bg-[#F6F2ED]">
		<div class="grid lg:grid-cols-2">
			<!-- ======================= LEFT : brand panel ======================= -->
			<div
				class="flex flex-col items-center justify-center px-8 py-14 text-center sm:px-12 sm:py-16 lg:py-20"
			>
				<img src="/logo.jpg" alt="Astronova" class="h-24 w-24 rounded-lg object-cover" />
				<h1 class="mt-7 font-heading text-display-xl font-medium text-navy-deep">Astronova</h1>
				<p class="mt-3 text-label font-semibold tracking-display text-muted-subtle uppercase">
					Technology in Harmony
				</p>

				<div class="mt-8 flex items-center gap-3">
					<span class="h-px w-12 bg-border-strong"></span>
					<span class="h-1.5 w-1.5 rounded-full bg-teal-light"></span>
					<span class="h-px w-12 bg-border-strong"></span>
				</div>

				<p class="mt-8 max-w-[34ch] text-body text-muted-foreground">
					Kelola perjalanan dinas, approval, dan keuangan dalam satu platform yang tenang &
					terorganisir.
				</p>
			</div>

			<!-- ======================= RIGHT : login form ======================= -->
			<div class="flex items-center justify-center px-8 py-12 sm:px-14 sm:py-16">
				<div class="w-full max-w-[380px]">
					<p class="text-label font-semibold tracking-display text-[#8FA9C6] uppercase">
						Selamat Datang
					</p>
					<h2 class="mt-3 font-heading text-display-lg font-medium text-white">Login</h2>
					<p class="mt-2 text-body-sm text-[#9FB2C6]">
						Masuk untuk lanjut mengelola perjalanan Anda.
					</p>

					<form
						onsubmit={(e) => {
							e.preventDefault();
							goto('/');
						}}
						class="mt-9 space-y-6"
					>
						<div>
							<label
								for="username"
								class="mb-2 block text-label font-semibold tracking-caps text-[#8FA9C6] uppercase"
							>
								Username
							</label>
							<div class="relative">
								<UserRound
									size={16}
									class="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#6E8299]"
								/>
								<input
									id="username"
									bind:value={username}
									type="text"
									autocomplete="username"
									placeholder="Masukkan username"
									class="w-full rounded-sm border border-white/15 bg-white/[0.06] py-3 pr-4 pl-10 text-body-sm text-white transition-colors placeholder:text-white/35 focus:border-teal-light focus:outline-none"
								/>
							</div>
						</div>

						<div>
							<div class="flex items-center justify-between">
								<label
									for="password"
									class="mb-2 block text-label font-semibold tracking-caps text-[#8FA9C6] uppercase"
								>
									Password
								</label>
								<span class="mb-2 text-meta text-[#6E8299]">Lupa password?</span>
							</div>
							<div class="relative">
								<Lock size={16} class="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#6E8299]" />
								<input
									id="password"
									bind:value={password}
									type={showPw ? 'text' : 'password'}
									autocomplete="current-password"
									placeholder="Masukkan password"
									class="w-full rounded-sm border border-white/15 bg-white/[0.06] py-3 pr-11 pl-10 text-body-sm text-white transition-colors placeholder:text-white/35 focus:border-teal-light focus:outline-none"
								/>
								<button
									type="button"
									onclick={() => (showPw = !showPw)}
									class="absolute top-1/2 right-3 -translate-y-1/2 text-[#6E8299] transition-colors hover:text-white"
									aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
								>
									{#if showPw}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
								</button>
							</div>
						</div>

						<button
							type="submit"
							class="flex w-full items-center justify-center gap-2 rounded-sm bg-secondary py-3.5 text-body-sm font-semibold text-white transition-colors hover:bg-[#4d7181] active:translate-y-px"
						>
							<LogIn size={16} />
							Login
						</button>

						<div class="flex items-center gap-2 pt-1">
							<ShieldCheck size={14} class="text-[#6E8299]" />
							<p class="text-meta text-[#6E8299]">Data kamu aman & terenkripsi.</p>
						</div>
					</form>

					<p class="mt-8 border-t border-white/10 pt-6 text-center text-meta text-[#7E90A4]">
						Belum punya akun? <span class="text-[#9FB2C6]">Hubungi admin Travel.</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
