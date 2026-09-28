<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		label?: string;
		class?: string;
		value?: string;
		id?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	const uid = $props.id();

	let {
		label = '',
		class: cls,
		value = $bindable(''),
		id = uid,
		children,
		...rest
	}: Props = $props();
</script>

{#if label}
	<label for={id} class="mb-1.5 block text-label font-semibold text-muted-subtle uppercase"
		>{label}</label
	>
{/if}
<div class="relative">
	<select
		{id}
		class={cn(
			'w-full appearance-none rounded-sm border border-input bg-surface-input px-3 py-2.5 pr-9 text-body-sm text-navy-deep transition-colors',
			'focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none',
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
