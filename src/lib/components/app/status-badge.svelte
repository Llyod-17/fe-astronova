<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import {
		bookingLabel,
		bookingTone,
		fundLabel,
		fundTone,
		genericTone,
		tripLabel,
		tripTone,
		type BadgeTone
	} from '$lib/status';
	import type { BookingStatus, FundStatus, TripStatus } from '$lib/types';

	type Props = {
		status: TripStatus | BookingStatus | FundStatus | string;
		label?: string;
		tone?: BadgeTone;
	};

	let { status, label, tone }: Props = $props();

	const TRIP_KEYS = [
		'draft',
		'menunggu_persetujuan',
		'disetujui',
		'berlangsung',
		'selesai',
		'ditolak'
	] as TripStatus[];

	const out = $derived(() => {
		if (tone) return { label: label ?? status, tone };
		const s = status;
		if ((TRIP_KEYS as string[]).includes(s)) {
			const t = s as TripStatus;
			return { label: tripLabel(t), tone: tripTone(t) };
		}
		if (s === 'confirmed' || s === 'pending' || s === 'cancelled') {
			const b = s as BookingStatus;
			return { label: bookingLabel(b), tone: bookingTone(b) };
		}
		if (s === 'dicairkan' || s === 'diajukan') {
			const f = s as FundStatus;
			return { label: fundLabel(f), tone: fundTone(f) };
		}
		return { label: label ?? status, tone: genericTone(status) };
	});
</script>

<Badge tone={out().tone}>{out().label}</Badge>
