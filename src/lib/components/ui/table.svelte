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
			<tr class="border-b border-border">
				{#each headers as h (h.label)}
					<th
						class={cn(
							'px-[12px] py-[12px] text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase',
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
