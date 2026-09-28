<script lang="ts">
	import { cn } from '$lib/utils';
	import { angka, rupiahShort } from '$lib/format';
	import { ArrowDownRight, ArrowUpRight } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		label: string;
		value: string | number;
		/** 'count' for quantities, 'currency' only for money. Never guess from the value. */
		format?: 'count' | 'currency';
		trend?: string;
		trendDir?: 'up' | 'down';
		note?: string;
		class?: string;
		children?: Snippet;
	};

	let {
		label,
		value,
		format = 'count',
		trend,
		trendDir = 'up',
		note,
		class: cls,
		children
	}: Props = $props();

	const display = $derived(
		typeof value === 'number' ? (format === 'currency' ? rupiahShort(value) : angka(value)) : value
	);
</script>

<div class={cn('rounded-lg border border-border bg-card p-[18px]', cls)}>
	<p class="text-label font-semibold text-muted-subtle uppercase">{label}</p>
	<p class="mt-2 font-heading text-display text-navy-deep tabular-nums">
		{display}
	</p>
	{#if trend}
		<p class="mt-3 flex items-center gap-1 border-t border-border-faint pt-2.5 text-meta">
			{#if trendDir === 'up'}
				<ArrowUpRight size={13} class="text-ok-fg" />
			{:else}
				<ArrowDownRight size={13} class="text-bad-fg" />
			{/if}
			<span class={trendDir === 'up' ? 'text-ok-fg' : 'text-bad-fg'}>{trend}</span>
			{#if note}
				<span class="text-muted-subtle">· {note}</span>
			{/if}
		</p>
	{/if}
	{@render children?.()}
</div>
