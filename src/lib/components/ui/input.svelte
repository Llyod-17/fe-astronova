<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		label?: string;
		class?: string;
		value?: string | number;
		[key: string]: unknown;
	};

	let { label = '', class: cls, value = $bindable(''), ...rest }: Props = $props();
</script>

{#if label}
	<label class="mb-1.5 block text-[12.5px] font-semibold text-navy-deep">{label}</label>
{/if}
<input
	class={cn(
		'w-full rounded-xl border border-input bg-surface-input px-[14px] py-[11px] text-[13px] text-navy-deep placeholder:text-muted-subtle',
		'focus:border-ring focus:ring-2 focus:ring-ring/40 focus:outline-none',
		cls
	)}
	bind:value
	{...rest}
/>
