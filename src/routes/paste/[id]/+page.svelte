<script lang="ts">
	import { getToastStore, CodeBlock } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores'; // TODO: Replace with non-deprecated alternative when upgrading
	import { pastesStore, currentPaste, pastesLoading, pastesError } from '$lib/stores/pastes';
	import { goto } from '$app/navigation';
	// import DOMPurify from 'dompurify';

	// Access the ID from the URL parameter with proper type checking
	$: id = $page.params.id ? parseInt($page.params.id, 10) : null;
	$: pw = $page.url.searchParams.get('pw');

	// Toast store for notifications
	const toastStore = getToastStore();

	// State for password input
	let passwordInput = '';

	// Auth state (would come from auth store in a real implementation)
	let isLoggedIn = false; // TODO: Replace with actual auth store
	$: isOwner = $currentPaste?.user_id === 'current-user-id'; // TODO: Replace with actual user ID check

	// Load the paste data when component mounts or ID changes
	$: if (id !== null) {
		loadPaste(id);
	}

	// Function to handle password submission
	function handlePasswordSubmit(): void {
		if (!passwordInput.trim()) {
			toastStore.trigger({
				message: 'Please enter a password',
				background: 'variant-filled-warning'
			});
			return;
		}

		// Construct new URL with password as query parameter

		// Navigate to the new URL
		// goto(`/paste/${id}?pw=${passwordInput}`);
		if (id !== null) loadPaste(id, passwordInput);
	}

	// Load the paste data when component mounts or ID changes
	$: if (id !== null) {
		loadPaste(id);
	}

	async function loadPaste(pasteId: number, passwordInput: string | null = pw): Promise<void> {
		try {
			await pastesStore.fetchPaste(pasteId, passwordInput);
		} catch (err: unknown) {
			console.log(err);
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';

			toastStore.trigger({
				message: 'Failed to load paste: ' + errorMessage,
				background: 'variant-filled-error'
			});
		}
	}

	// Copy paste content to clipboard
	async function copyToClipboard(): Promise<void> {
		if (!$currentPaste) return;

		try {
			await navigator.clipboard.writeText($currentPaste.content);
			toastStore.trigger({
				message: 'Copied to clipboard!',
				background: 'variant-filled-success'
			});
		} catch (err: unknown) {
			console.error('Failed to copy: ', err);
			toastStore.trigger({
				message: 'Failed to copy to clipboard',
				background: 'variant-filled-error'
			});
		}
	}

	// Delete the paste using the store
	async function deletePaste(): Promise<void> {
		if (!$currentPaste) return;

		if (confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
			try {
				await pastesStore.deletePaste($currentPaste.id);
				toastStore.trigger({
					message: 'Paste deleted successfully',
					background: 'variant-filled-success'
				});
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

<div class="container mx-auto p-6 max-w-5xl">
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
		<div class="card variant-soft p-8 flex justify-center items-center h-64">
			<div class="flex flex-col items-center gap-4">
				<div class="loader h-12 w-12"></div>
				<p>Loading paste content...</p>
			</div>
		</div>
	{:else if $pastesError}
		{#if $pastesError.message === 'Error verifying password'}
			<div class="card variant-soft-warning p-6">
				<div class="flex justify-center w-full">
					<div class="flex flex-col items-center max-w-md w-full">
						<div class="flex gap-2 items-center mb-2">
							<span class="md:text-3xl">⚠️</span>
							<h3 class="h3 font-bold">Password Required</h3>
						</div>

						<div
							class="input-group input-group-divider md:grid-cols-[auto_1fr_auto] w-full mt-2 rounded-xl sm:rounded-3xl"
						>
							<div
								class="input-group-shim flex flex-row sm:text-center h-[30px] md:h-[auto] sm:justify-center"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 24 24"
									{...$$props}
									><!-- Icon from All by undefined - undefined --><path
										fill="currentColor"
										fill-rule="evenodd"
										d="M3.172 5.172C2 6.343 2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h4c3.771 0 5.657 0 6.828-1.172S22 15.771 22 12s0-5.657-1.172-6.828S17.771 4 14 4h-4C6.229 4 4.343 4 3.172 5.172M12.75 10a.75.75 0 0 0-1.5 0v.701l-.607-.35a.75.75 0 0 0-.75 1.298l.607.35l-.607.351a.75.75 0 1 0 .75 1.3l.607-.351V14a.75.75 0 0 0 1.5 0v-.7l.607.35a.75.75 0 0 0 .75-1.3L13.5 12l.607-.35a.75.75 0 0 0-.75-1.3l-.607.35zm-6.017-.75a.75.75 0 0 1 .75.75v.7l.606-.35a.75.75 0 0 1 .75 1.3l-.607.35l.607.35a.75.75 0 1 1-.75 1.3l-.606-.35v.7a.75.75 0 0 1-1.5 0v-.701l-.608.35a.75.75 0 0 1-.75-1.298L5.232 12l-.607-.35a.75.75 0 1 1 .75-1.3l.608.351V10a.75.75 0 0 1 .75-.75m11.285.75a.75.75 0 0 0-1.5 0v.701l-.607-.35a.75.75 0 0 0-.75 1.298l.607.35l-.608.351a.75.75 0 0 0 .75 1.3l.608-.351V14a.75.75 0 0 0 1.5 0v-.7l.607.35a.75.75 0 0 0 .75-1.3l-.607-.35l.607-.35a.75.75 0 0 0-.75-1.3l-.607.35z"
										clip-rule="evenodd"
									/></svg
								>
							</div>
							<input type="search" placeholder="Enter password..." bind:value={passwordInput} />
							<button
								class="variant-filled-secondary text-center h-[32px] md:h-[auto]"
								onclick={handlePasswordSubmit}>Submit</button
							>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="card variant-filled-error p-6">
				<div class="flex gap-4 items-start">
					<span class="text-3xl">⚠️</span>
					<div>
						<h3 class="h3 font-bold">Error Loading Paste</h3>
						<p>{$pastesError.message}</p>
						<button class="btn variant-soft mt-4" onclick={() => loadPaste(id || 0)}
							>Try Again</button
						>
					</div>
				</div>
			</div>
		{/if}
	{:else if $currentPaste}
		<div class="card variant-filled-surface shadow-xl">
			<!-- Card Header with metadata -->
			<header class="card-header p-6 flex flex-col sm:flex-row justify-between gap-4">
				<div class="space-y-4 flex-1">
					<h2 class="h2 font-bold">{$currentPaste.title}</h2>

					<div class="flex flex-wrap gap-3">
						<div class="chip variant-soft-primary cursor-default">
							<span>Creator: {$currentPaste.user_id || 'Anonymous'}</span>
						</div>

						{#if $currentPaste.expiresAt}
							<div class="chip variant-soft-warning cursor-default">
								<span>Expires: {new Date($currentPaste.expiresAt).toLocaleString()}</span>
							</div>
						{/if}

						{#if $currentPaste.createdAt}
							<div class="chip variant-soft-primary cursor-default">
								<span>Created: {new Date($currentPaste.createdAt).toLocaleString()}</span>
							</div>
						{/if}

						<!-- {#if $currentPaste.syntax_highlight} -->
						<!-- 	<div class="chip variant-soft-tertiary"> -->
						<!-- 		<span>Syntax: {$currentPaste.syntax_highlight}</span> -->
						<!-- 	</div> -->
						<!-- {/if} -->
					</div>
				</div>

				<div class="flex flex-wrap gap-2 self-end sm:self-auto">
					<!-- <button class="btn variant-filled-primary" on:click={copyToClipboard}> -->
					<!-- 	<svg -->
					<!-- 		xmlns="http://www.w3.org/2000/svg" -->
					<!-- 		width="1em" -->
					<!-- 		height="1em" -->
					<!-- 		viewBox="0 0 256 256" -->
					<!-- 		class="mr-2" -->
					<!-- 	> -->
					<!-- 		<path -->
					<!-- 			fill="currentColor" -->
					<!-- 			d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z" -->
					<!-- 		/> -->
					<!-- 	</svg> -->
					<!-- 	Copy -->
					<!-- </button> -->

					{#if isLoggedIn && isOwner}
						<button class="btn variant-filled-error" onclick={deletePaste}>
							<span class="material-symbols-outlined mr-2">delete</span>
							Delete
						</button>
					{/if}
				</div>
			</header>

			<hr class="opacity-50" />

			<!-- Content display, with HTML parsing or code block depending on type -->
			<div class="p-0">
				<!-- {#if $currentPaste.syntax_highlight} -->
				<!-- 	<div class="card p-0 variant-ghost rounded-none"> -->
				<!-- 		<pre -->
				<!-- 			class="whitespace-pre-wrap overflow-x-auto p-6 text-sm font-mono">{$currentPaste.content}</pre> -->
				<!-- 	</div> -->
				<!-- {:else} -->
				<!-- For regular content that might contain HTML -->
				<div class="card p-6 variant-ghost rounded-none">
					<div class="prose dark:prose-invert max-w-none">
						<!-- {@html DOMPurify.sanitize($currentPaste.content)} -->
						<CodeBlock language="javascript" code={$currentPaste.content} />

						<!-- <CodeBlock language="html" code={`<div>This is meta</div>`}></CodeBlock> -->
					</div>
				</div>
				<!-- {/if} -->
			</div>
		</div>
	{:else}
		<div class="card variant-filled-warning p-6">
			<div class="flex gap-4 items-start">
				<span class="text-3xl">🔍</span>
				<div>
					<h3 class="h3 font-bold">Paste Not Found</h3>
					<p>We couldn't find a paste with ID: {id}</p>
					<a href="/" class="btn variant-soft-surface mt-4">Return to Home</a>
				</div>
			</div>
		</div>
	{/if}
</div>
