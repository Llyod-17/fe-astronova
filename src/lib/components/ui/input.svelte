<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		label?: string;
		class?: string;
		value?: string | number;
		id?: string;
		[key: string]: unknown;
	};

	const uid = $props.id();

	let { label = '', class: cls, value = $bindable(''), id = uid, ...rest }: Props = $props();
</script>

{#if label}
	<label for={id} class="mb-1.5 block text-label font-semibold text-muted-subtle uppercase"
		>{label}</label
	>
{/if}
<input
	{id}
	class={cn(
		'w-full rounded-sm border border-input bg-surface-input px-3 py-2.5 text-body-sm text-navy-deep transition-colors placeholder:text-muted-subtle',
		'focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none',
		cls
	)}
	bind:value
	{...rest}
/>
