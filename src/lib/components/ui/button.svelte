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
		'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none';
	const variants = {
		teal: 'bg-secondary text-white shadow-btn-teal hover:brightness-[1.06]',
		navy: 'bg-navy-deep text-[#f5efeb] shadow-btn-navy hover:opacity-95',
		outline: 'bg-transparent text-primary border-[1.5px] border-primary hover:bg-primary/5',
		ghost: 'bg-transparent text-primary hover:bg-primary/5'
	};
	const sizes = {
		md: 'text-[13px] px-[22px] py-[11px]',
		sm: 'text-[12px] px-[15px] py-[8px]'
	};
</script>

<button class={cn(base, variants[variant], sizes[size], cls)} {...rest}>
	{@render children?.()}
</button>
