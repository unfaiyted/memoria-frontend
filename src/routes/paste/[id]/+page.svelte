<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/state';
	import { pastesStore, currentPaste, pastesLoading, pastesError } from '$lib/stores/pastes';
	import PasteError from '$lib/components/paste/PasteError.svelte';
	import PasteMissing from '$lib/components/paste/PasteMissing.svelte';
	import PasteLoading from '$lib/components/paste/PasteLoading.svelte';
	import PasteView from '$lib/components/paste/PasteView.svelte';
	import PasteShareButtonGroup from '$lib/components/paste/PasteShareButtonGroup.svelte';

	// Toast store for notifications
	const toastStore = getToastStore();

	// State for password input
	let passwordInput = $state('');
	let id = $state<number | null>(null);
	let pw = $state<string | null>(null);

	// Function to handle password submission
	function handlePasswordSubmit(pass: string): void {
		if (!pass.trim()) {
			toastStore.trigger({
				message: 'Please enter a password',
				background: 'variant-filled-warning'
			});
			return;
		}

		if (id !== null) loadPaste(id, pass);
	}

	async function loadPaste(pasteId: number, passwordInput: string | null = pw): Promise<void> {
		try {
			await pastesStore.fetchPaste(pasteId, passwordInput);
		} catch (err: unknown) {}
	}

	$effect(() => {
		id = page.params.id ? parseInt(page.params.id, 10) : null;
		pw = page.url.searchParams.get('pw');

		if (id !== null) {
			loadPaste(id, pw);
		}
	});
</script>

<div class="container mx-auto p-2 sm:p-6 max-w-5xl">
	<!-- Breadcrumbs navigation -->
	<nav class=" mb-4 flex flex-row justify-between">
		<ol class="breadcrumb flex items-center space-x-2 text-sm">
			<li class="crumb"><a href="/" class="anchor hover:underline">Home</a></li>
			<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
			<li class="crumb">Paste {id}</li>
		</ol>
		<PasteShareButtonGroup isDropDownEnabled={false} />
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
