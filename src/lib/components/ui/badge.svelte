<script lang="ts">
	import { cn } from '$lib/utils';
	import type { BadgeTone } from '$lib/status';
	import type { Snippet } from 'svelte';

	type Props = {
		tone?: BadgeTone;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let { tone = 'neutral', class: cls, children, ...rest }: Props = $props();

	const tones: Record<BadgeTone, string> = {
		ok: 'bg-ok-bg text-ok-fg',
		pend: 'bg-pend-bg text-pend-fg',
		sky: 'bg-sky-bg text-sky-fg',
		bad: 'bg-bad-bg text-bad-fg',
		neutral: 'bg-muted text-muted-foreground'
	};
</script>

<span
	class={cn(
		'inline-flex items-center gap-1 rounded-xs px-2 py-[3px] text-label font-semibold whitespace-nowrap',
		tones[tone],
		cls
	)}
	{...rest}
>
	{@render children?.()}
</span>
