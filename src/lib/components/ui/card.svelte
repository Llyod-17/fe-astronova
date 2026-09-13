<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		padding?: 'card' | 'stat' | 'none';
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let { padding = 'card', class: cls, children, ...rest }: Props = $props();

	const pad = {
		card: 'p-[26px_28px]',
		stat: 'p-[22px_22px_20px]',
		none: ''
	};
</script>

<div
	class={cn(
		'rounded-[26px] border border-border bg-card text-card-foreground shadow-soft',
		pad[padding],
		cls
	)}
	{...rest}
>
	{@render children?.()}
</div>
