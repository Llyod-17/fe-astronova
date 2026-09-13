<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		label?: string;
		class?: string;
		value?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let { label = '', class: cls, value = $bindable(''), children, ...rest }: Props = $props();
</script>

{#if label}
	<label class="mb-1.5 block text-[12.5px] font-semibold text-navy-deep">{label}</label>
{/if}
<div class="relative">
	<select
		class={cn(
			'w-full appearance-none rounded-xl border border-input bg-surface-input px-[14px] py-[11px] pr-9 text-[13px] text-navy-deep',
			'focus:border-ring focus:ring-2 focus:ring-ring/40 focus:outline-none',
			cls
		)}
		bind:value
		{...rest}
	>
		{@render children?.()}
	</select>
	<ChevronDown
		size={15}
		class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-subtle"
	/>
</div>
