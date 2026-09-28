<script lang="ts">
	import { cn } from '$lib/utils';

	type Opt = { key: string; label: string };

	type Props = { options: Opt[]; value?: string };

	let { options, value = $bindable('') }: Props = $props();
</script>

<div class="flex flex-wrap gap-1.5">
	<button
		onclick={() => (value = '')}
		class={cn(
			'rounded-sm px-3 py-1.5 text-meta font-semibold transition-colors',
			value === ''
				? 'bg-navy-deep text-[#f5efeb]'
				: 'border border-border bg-card text-primary hover:bg-muted'
		)}
	>
		Semua
	</button>
	{#each options as o (o.key)}
		<button
			onclick={() => (value = value === o.key ? '' : o.key)}
			class={cn(
				'rounded-sm px-3 py-1.5 text-meta font-semibold transition-colors',
				value === o.key
					? 'bg-navy-deep text-[#f5efeb]'
					: 'border border-border bg-card text-primary hover:bg-muted'
			)}
		>
			{o.label}
		</button>
	{/each}
</div>
