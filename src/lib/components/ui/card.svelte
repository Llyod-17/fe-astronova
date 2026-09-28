<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		padding?: 'card' | 'stat' | 'none';
		/** 'top' adds the 2px navy rule that marks the one dominant card on a page. */
		edge?: 'none' | 'top';
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let { padding = 'card', edge = 'none', class: cls, children, ...rest }: Props = $props();

	const pad = {
		card: 'p-6',
		stat: 'p-[18px]',
		none: ''
	};
</script>

<div
	class={cn(
		'rounded-lg border border-border bg-card text-card-foreground',
		edge === 'top' && 'border-t-2 border-t-navy-deep',
		pad[padding],
		cls
	)}
	{...rest}
>
	{@render children?.()}
</div>
