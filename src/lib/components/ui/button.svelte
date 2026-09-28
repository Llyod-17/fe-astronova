<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		variant?: 'teal' | 'navy' | 'outline' | 'ghost';
		size?: 'md' | 'sm';
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let { variant = 'teal', size = 'md', class: cls, children, ...rest }: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer select-none active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none';
	const variants = {
		teal: 'bg-secondary text-white hover:bg-[#4d7181]',
		navy: 'bg-navy-deep text-[#f5efeb] hover:bg-[#2a3a4d]',
		outline: 'bg-transparent text-primary border border-border-strong hover:bg-muted',
		ghost: 'bg-transparent text-primary hover:bg-muted'
	};
	const sizes = {
		md: 'text-body-sm px-[18px] py-[9px]',
		sm: 'text-meta px-[13px] py-[6px]'
	};
</script>

<button class={cn(base, variants[variant], sizes[size], cls)} {...rest}>
	{@render children?.()}
</button>
