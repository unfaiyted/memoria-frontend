<script lang="ts">
	import type { ApiError } from '$lib/api/errors';

	interface PasteErrorProps {
		id: string | number | null;
	}
	let { id }: PasteErrorProps = $props();
</script>

<div class="card variant-filled-warning p-6">
	<div class="flex gap-4 items-start">
		<span class="text-3xl">🔍</span>
		<div>
			<h3 class="h3 font-bold">Paste Not Found</h3>
			<p>We couldn't find a paste with {typeof id == 'number' ? '' : 'access'} ID: {id}</p>
			<a href="/" class="btn variant-soft-surface mt-4">Return to Home</a>
		</div>
	</div>
</div>
