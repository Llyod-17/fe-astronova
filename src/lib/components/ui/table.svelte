<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		headers: { label: string; align?: 'left' | 'right' | 'center' }[];
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	};

	let { headers, children, class: cls, ...rest }: Props = $props();
</script>

<div class={cn('overflow-x-auto', cls)}>
	<table class="w-full border-collapse text-left">
		<thead>
			<tr class="border-b border-border-strong">
				{#each headers as h (h.label)}
					<th
						class={cn(
							'px-3 py-2.5 text-label font-semibold whitespace-nowrap text-muted-subtle uppercase',
							h.align === 'right' && 'text-right',
							h.align === 'center' && 'text-center'
						)}
					>
						{h.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody {...rest}>
			{@render children?.()}
		</tbody>
	</table>
</div>
