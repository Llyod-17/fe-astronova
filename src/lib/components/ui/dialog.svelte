<script lang="ts">
	import { cn } from '$lib/utils';
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		onOpenChange?: (open: boolean) => void;
		title?: string;
		class?: string;
		children?: Snippet;
	};

	let { open, onOpenChange = () => {}, title = '', class: cls, children }: Props = $props();
	let el: HTMLDialogElement;

	$effect(() => {
		if (!el) return;
		if (open && !el.open) el.showModal();
		else if (!open && el.open) el.close();
	});

	$effect(() => {
		if (!el) return;
		const onClose = () => onOpenChange(false);
		const onCancel = (e: Event) => {
			e.preventDefault();
			onOpenChange(false);
		};
		el.addEventListener('close', onClose);
		el.addEventListener('cancel', onCancel);
		return () => {
			el.removeEventListener('close', onClose);
			el.removeEventListener('cancel', onCancel);
		};
	});
</script>

<dialog
	bind:this={el}
	class={cn(
		'w-[calc(100vw-32px)] max-w-lg rounded-[26px] bg-card p-0 text-card-foreground shadow-topbar',
		'backdrop:bg-navy-deep/40 backdrop:backdrop-blur-[2px]',
		'border border-border',
		cls
	)}
>
	<div class="flex items-center justify-between border-b border-border px-6 py-4">
		<h3 class="font-heading text-lg font-medium text-navy-deep">{title}</h3>
		<button
			onclick={() => onOpenChange(false)}
			class="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-navy-deep"
			aria-label="Tutup dialog"
		>
			<X size={16} />
		</button>
	</div>
	<div class="px-6 py-5">{@render children?.()}</div>
</dialog>
