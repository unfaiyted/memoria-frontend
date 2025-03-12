<script>
	import { getToastStore } from '@skeletonlabs/skeleton';

	// Paste data (would come from your route)
	export let pasteContent = 'This is a sample paste content';
	export let expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Example: 7 days from now
	export let creator = null; // Creator username if available
	export let isOwner = false; // Whether current user owns this paste
	export let isLoggedIn = false; // Whether user is logged in

	// Toast store for notifications
	const toastStore = getToastStore();

	// Copy paste content to clipboard
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(pasteContent);
			toastStore.trigger({
				message: 'Copied to clipboard!',
				background: 'variant-filled-success'
			});
		} catch (err) {
			// console.error('Failed to copy: ', err);
			toastStore.trigger({
				message: 'Failed to copy to clipboard',
				background: 'variant-filled-error'
			});
		}
	}

	// Delete the paste (would call your API)
	function deletePaste() {
		if (confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
			// API call would go here
			toastStore.trigger({
				message: 'Paste deleted successfully',
				background: 'variant-filled-success'
			});
			// Redirect would happen here
		}
	}
</script>

<div class="container mx-auto p-4 space-y-8">
	<header class="text-center space-y-2">
		<h1 class="h1">Paste Viewer</h1>
		<p class="text-surface-500-400-token">View and manage your paste</p>
	</header>

	<div class="card variant-filled-surface p-4">
		<header
			class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
		>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<span class="badge variant-soft">Creator</span>
					<span class="font-semibold">{creator || 'Anonymous'}</span>
				</div>

				{#if expirationDate}
					<div class="flex items-center gap-2">
						<span class="badge variant-soft">Expires</span>
						<span>{new Date(expirationDate).toLocaleString()}</span>
					</div>
				{/if}
			</div>

			<div class="flex gap-2">
				<button class="btn variant-filled-primary" on:click={copyToClipboard}>
					<span class="material-symbols-outlined mr-2">content_copy</span>
					Copy
				</button>

				{#if isLoggedIn && isOwner}
					<button class="btn variant-filled-error" on:click={deletePaste}>
						<span class="material-symbols-outlined mr-2">delete</span>
						Delete
					</button>
				{/if}
			</div>
		</header>

		<div class="card variant-ghost p-4">
			<pre class="whitespace-pre-wrap break-words">{pasteContent}</pre>
		</div>
	</div>
</div>
