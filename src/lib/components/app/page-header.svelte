<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		supertitle: string;
		title: string;
		desc?: string;
		actions?: Snippet;
		children?: Snippet;
	};

	let { supertitle, title, desc, actions, children }: Props = $props();
</script>

<div>
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-[12px] font-semibold tracking-[0.08em] text-muted-subtle uppercase">
				{supertitle}
			</p>
			<h2 class="mt-1 font-heading text-[26px] leading-tight font-medium text-navy-deep">
				{title}
			</h2>
			{#if desc}
				<p class="mt-1 max-w-2xl text-[13px] text-muted-foreground">{desc}</p>
			{/if}
		</div>
		{#if actions}
			<div class="flex flex-wrap items-center gap-2">{@render actions?.()}</div>
		{/if}
	</div>
	{@render children?.()}
</div>
