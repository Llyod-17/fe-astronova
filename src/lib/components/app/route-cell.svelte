<script lang="ts">
	type Props = { from: string; to: string };
	let { from, to }: Props = $props();
</script>

<div class="flex items-center gap-2 whitespace-nowrap">
	<span class="text-[13px] font-semibold text-navy-deep">{from}</span>
	<svg width="14" height="10" viewBox="0 0 14 10" fill="none" class="text-muted-subtle">
		<path
			d="M1 5h11M9 1l3 4-3 4"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	<span class="text-[13px] font-semibold text-navy-deep">{to}</span>
</div>
