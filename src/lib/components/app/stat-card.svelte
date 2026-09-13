<script lang="ts">
	import { cn } from '$lib/utils';
	import { rupiahShort } from '$lib/format';
	import { ArrowDownRight, ArrowUpRight } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		label: string;
		value: string | number;
		trend?: string;
		trendDir?: 'up' | 'down';
		note?: string;
		class?: string;
		children?: Snippet;
	};

	let { label, value, trend, trendDir = 'up', note, class: cls, children }: Props = $props();
</script>

<div
	class={cn(
		'relative overflow-hidden rounded-[20px] border border-border bg-card p-[22px_22px_20px] shadow-soft',
		'before:absolute before:top-[-22px] before:right-[-22px] before:h-[92px] before:w-[92px] before:rounded-full before:bg-[linear-gradient(135deg,#C8D9E6,#7196A5)] before:opacity-[0.5] before:content-[""]',
		cls
	)}
>
	<div class="relative">
		<p class="text-[12px] font-medium text-muted-subtle">{label}</p>
		<p class="mt-1.5 font-heading text-[25px] leading-[1.2] font-medium text-navy-deep">
			{typeof value === 'number' ? rupiahShort(value) : value}
		</p>
		{#if trend}
			<p class="mt-1.5 flex items-center gap-1 text-[12px] font-medium">
				{#if trendDir === 'up'}
					<ArrowUpRight size={14} class="text-ok-fg" />
				{:else}
					<ArrowDownRight size={14} class="text-bad-fg" />
				{/if}
				<span class={trendDir === 'up' ? 'text-ok-fg' : 'text-bad-fg'}>{trend}</span>
				{#if note}
					<span class="text-muted-subtle">· {note}</span>
				{/if}
			</p>
		{/if}
		{@render children?.()}
	</div>
</div>
