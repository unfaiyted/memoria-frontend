<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/state';
	import { pastesStore, currentPaste, pastesLoading, pastesError } from '$lib/stores/pastes';
	import PasteError from '$lib/components/paste/PasteError.svelte';
	import PasteMissing from '$lib/components/paste/PasteMissing.svelte';
	import PasteLoading from '$lib/components/paste/PasteLoading.svelte';
	import PasteView from '$lib/components/paste/PasteView.svelte';

	// Toast store for notifications
	const toastStore = getToastStore();

	// Access the ID from the URL parameter with proper type checking
	const id = page.params.id ? parseInt(page.params.id, 10) : null;
	const pw = page.url.searchParams.get('pw');

	// State for password input
	let passwordInput = $state('');

	// Function to handle password submission
	function handlePasswordSubmit(): void {
		if (!passwordInput.trim()) {
			toastStore.trigger({
				message: 'Please enter a password',
				background: 'variant-filled-warning'
			});
			return;
		}

		if (id !== null) loadPaste(id, passwordInput);
	}

	// Load the paste data when component mounts or ID changes
	if (id !== null) {
		loadPaste(id);
	}

	async function loadPaste(pasteId: number, passwordInput: string | null = pw): Promise<void> {
		try {
			await pastesStore.fetchPaste(pasteId, passwordInput);
		} catch (err: unknown) {}
	}
</script>

<div class="container mx-auto p-2 sm:p-6 max-w-5xl">
	<!-- Breadcrumbs navigation -->
	<nav class="breadcrumb mb-4">
		<ol class="flex items-center space-x-2 text-sm">
			<li><a href="/" class="anchor hover:underline">Home</a></li>
			<li class="text-surface-500-400-token">•</li>
			<li>Paste {id}</li>
		</ol>
	</nav>

	<header class="text-center mb-8">
		<h1 class="h1 font-bold">Paste Viewer</h1>
		<p class="text-surface-500-400-token">View and manage shared content</p>
	</header>

	{#if $pastesLoading}
		<PasteLoading />
	{:else if $pastesError}
		<PasteError
			error={$pastesError}
			{passwordInput}
			{handlePasswordSubmit}
			id={id || 0}
			onRetry={(id) => {
				if (id && typeof id === 'number') {
					loadPaste(id);
				}
			}}
		/>
	{:else if $currentPaste}
		<PasteView paste={$currentPaste} />
	{:else}
		<PasteMissing {id} />
	{/if}
</div>
