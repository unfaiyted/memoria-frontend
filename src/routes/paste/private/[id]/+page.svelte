<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/state';
	import { pastesStore, currentPaste, pastesLoading, pastesError } from '$lib/stores/pastes';
	import { pasteStorage } from '$lib/data/storage';
	import { goto } from '$app/navigation';

	import PasteShareButtonGroup from '$lib/components/paste/PasteShareButtonGroup.svelte';
	import PasteMissing from '$lib/components/paste/PasteMissing.svelte';
	import PasteLoading from '$lib/components/paste/PasteLoading.svelte';
	import PasteView from '$lib/components/paste/PasteView.svelte';
	import PasteError from '$lib/components/paste/PasteError.svelte';

	const toastStore = getToastStore();

	// Access the ID from the URL parameter with proper type checking
	const accessId = page.params.id ? page.params.id : null;
	const pw = page.url.searchParams.get('pw');

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

		if (accessId !== null) loadPrivatePaste(accessId, passwordInput);
	}

	// Load the paste data when component mounts or ID changes
	if (accessId !== null) {
		loadPrivatePaste(accessId);
	}

	async function loadPrivatePaste(
		pasteId: string,
		passwordInput: string | null = pw
	): Promise<void> {
		try {
			await pastesStore.fetchPrivatePaste(pasteId, passwordInput);
			pasteStorage.addPasteAccessId(pasteId);
		} catch (err: unknown) {}
	}

	// Delete the paste using the store
	async function deleteLocalPaste(): Promise<void> {
		if (!$currentPaste) return;

		if (confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
			try {
				if ($currentPaste.privateAccessId) {
					pastesStore.removePrivatePaste($currentPaste.privateAccessId);
					toastStore.trigger({
						message: 'Paste deleted successfully',
						background: 'variant-filled-success'
					});
				}
				// Redirect to home page after deletion
				goto('/');
			} catch (err: unknown) {
				const errorMessage = err instanceof Error ? err.message : 'Unknown error';
				toastStore.trigger({
					message: 'Failed to delete paste: ' + errorMessage,
					background: 'variant-filled-error'
				});
			}
		}
	}
</script>

<div class="container mx-auto p-2 sm:p-6 max-w-5xl">
	<!-- Breadcrumbs navigation -->
	<nav class=" mb-4 flex flex-row justify-between">
		<ol class="breadcrumb flex items-center space-x-2 text-sm">
			<li class="crumb"><a href="/" class="anchor hover:underline">Home</a></li>
			<li class="crumb-separator">&rsaquo;</li>
			<li class="crumb">Private Paste</li>
		</ol>
		<PasteShareButtonGroup handleDelete={deleteLocalPaste} isDropDownEnabled={true} />
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
			id={accessId || ''}
			onRetry={(id) => {
				if (id && typeof id === 'string') {
					loadPrivatePaste(id);
				}
			}}
		/>
	{:else if $currentPaste}
		<PasteView paste={$currentPaste} />
	{:else}
		<PasteMissing id={accessId} />
	{/if}
</div>
