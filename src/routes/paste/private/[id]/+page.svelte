<script lang="ts">
	import { onMount } from 'svelte';
	import { getToastStore, CodeBlock } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores'; // TODO: Replace with non-deprecated alternative when upgrading
	import { pastesStore, currentPaste, pastesLoading, pastesError } from '$lib/stores/pastes';
	import { goto } from '$app/navigation';
	import DOMPurify from 'dompurify';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	// Access the ID from the URL parameter with proper type checking
	$: accessId = $page.params.id ? $page.params.id : null;
	$: pw = $page.url.searchParams.get('pw');

	// Toast store for notifications
	const toastStore = getToastStore();

	// State for password input
	let passwordInput = '';

	// Auth state (would come from auth store in a real implementation)
	let isLoggedIn = false; // TODO: Replace with actual auth store
	$: isOwner = $currentPaste?.user_id === 'current-user-id'; // TODO: Replace with actual user ID check

	function calculateTimeLeftPercentage(createdAt: string | Date, expiresAt: string | Date): number {
		const created = new Date(createdAt);
		const expires = new Date(expiresAt);
		const now = new Date();

		const totalDuration = expires.getTime() - created.getTime();
		const elapsed = now.getTime() - created.getTime();

		// If already expired, return 0
		if (now > expires) return 0;

		// Calculate percentage of time left
		const timeLeftPercentage = 100 - (elapsed / totalDuration) * 100;

		return Math.max(0, Math.round(timeLeftPercentage));
	}

	function formatTimeLeft(expiresAt: string | Date): string {
		const expires = new Date(expiresAt);
		const now = new Date();
		const timeLeftMs = expires.getTime() - now.getTime();

		// If already expired
		if (timeLeftMs <= 0) return 'Expired';

		// Calculate time units
		const seconds = Math.floor(timeLeftMs / 1000) % 60;
		const minutes = Math.floor(timeLeftMs / (1000 * 60)) % 60;
		const hours = Math.floor(timeLeftMs / (1000 * 60 * 60)) % 24;
		const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));

		// Format based on the largest significant time unit
		if (days > 0) {
			return `${days} ${days === 1 ? 'day' : 'days'} left`;
		} else if (hours > 0) {
			return `${hours} ${hours === 1 ? 'hr' : 'hrs'} left`;
		} else if (minutes > 0) {
			return `${minutes} ${minutes === 1 ? 'min' : 'mins'} left`;
		} else {
			return `${seconds} ${seconds === 1 ? 'sec' : 'secs'} left`;
		}
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

		if (accessId !== null) loadPaste(accessId, passwordInput);
	}

	// Load the paste data when component mounts or ID changes
	$: if (accessId !== null) {
		loadPaste(accessId);
	}

	async function loadPaste(pasteId: string, passwordInput: string | null = pw): Promise<void> {
		console.log(pasteId);
		try {
			await pastesStore.fetchPrivatePaste(pasteId, passwordInput);
		} catch (err: unknown) {
			console.log(err);
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
	// async function deletePaste(): Promise<void> {
	// 	if (!$currentPaste) return;
	//
	// 	if (confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
	// 		try {
	// 			await pastesStore.deletePaste($currentPaste.id);
	// 			toastStore.trigger({
	// 				message: 'Paste deleted successfully',
	// 				background: 'variant-filled-success'
	// 			});
	// 			// Redirect to home page after deletion
	// 			goto('/');
	// 		} catch (err: unknown) {
	// 			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
	// 			toastStore.trigger({
	// 				message: 'Failed to delete paste: ' + errorMessage,
	// 				background: 'variant-filled-error'
	// 			});
	// 		}
	// 	}
	// }

	let isScrolled = false;
	let scrollDistance = 0;

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 200;
			scrollDistance = window.scrollY - 150;
			console.log(isScrolled);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div class="container mx-auto p-2 sm:p-6 max-w-5xl">
	<!-- Breadcrumbs navigation -->
	<nav class="breadcrumb mb-4">
		<ol class="flex items-center space-x-2 text-sm">
			<li><a href="/" class="anchor hover:underline">Home</a></li>
			<li class="text-surface-500-400-token">•</li>
			<li>Private Paste</li>
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
							<input
								type="password"
								placeholder="Enter password..."
								bind:value={passwordInput}
								onkeypress={(e) => {
									if (e.key === 'Enter') {
										handlePasswordSubmit();
									}
								}}
							/>
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
						<button class="btn variant-soft mt-4" onclick={() => loadPaste(accessId || '')}
							>Try Again</button
						>
					</div>
				</div>
			</div>
		{/if}
	{:else if $currentPaste}
		<div class="card variant-ghost-surface shadow-xl relative">
			<!-- Float button -->
			<button
				class="btn-icon variant-filled-secondary float-button {scrollDistance < 225 &&
				$currentPaste.editorType == 'code'
					? 'hidden'
					: ''}"
				style={isScrolled ? `top: calc(1rem + ${scrollDistance}px);` : ''}
				title="Copy to clipboard"
				aria-label="Copy to clipboard"
				onclick={copyToClipboard}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm0 0V4v12Z"
					/>
				</svg>
			</button>
			<!-- Card Header with metadata -->
			<header
				class="card-header p-6 flex flex-col sm:flex-row justify-items-start text-center sm:text-left gap-4"
			>
				<div class="space-y-4 flex-1 flex flex-col sm:flex-row sm:justify-start">
					<div
						class="space-y-4 flex flex-col sm:flex-row sm:items-center justify-between order-2 w-full"
					>
						<h2 class="h2 font-bold pt-3 sm:pt-0 sm:pl-4">{$currentPaste.title}</h2>
						<div class="chip variant-soft-primary cursor-default max-h-8">
							<span>Creator: {$currentPaste.user_id || 'Anonymous'}</span>
						</div>
					</div>
					<div class="flex flex-wrap gap-3 order-1 mx-auto sm:mx-0 sm:max-w-30">
						<!-- {#if $currentPaste.expiresAt} -->
						<!-- 	<div class="chip variant-soft-warning cursor-default"> -->
						<!-- 		<span>Expires: {new Date($currentPaste.expiresAt).toLocaleString()}</span> -->
						<!-- 	</div> -->
						<!-- {/if} -->
						<!---->
						<!-- {#if $currentPaste.createdAt} -->
						<!-- 	<div class="chip variant-soft-primary cursor-default"> -->
						<!-- 		<span>Created: {new Date($currentPaste.createdAt).toLocaleString()}</span> -->
						<!-- 	</div> -->
						<!-- {/if} -->

						{#if $currentPaste.createdAt && $currentPaste.expiresAt}
							<div>
								<ProgressRadial
									value={calculateTimeLeftPercentage(
										$currentPaste.createdAt,
										$currentPaste.expiresAt
									)}
									width="w-24"
									stroke={50}
									meter="stroke-primary-500"
									track="stroke-primary-500/30"
								>
									{formatTimeLeft($currentPaste.expiresAt)}
								</ProgressRadial>
							</div>
						{/if}
					</div>
				</div>

				<!-- <div class="flex flex-wrap gap-2 self-end sm:self-auto"> -->
				<!-- 	{#if isLoggedIn && isOwner} -->
				<!-- 		<button class="btn variant-filled-error" onclick={deletePaste}> -->
				<!-- 			<span class="material-symbols-outlined mr-2">delete</span> -->
				<!-- 			Delete -->
				<!-- 		</button> -->
				<!-- 	{/if} -->
				<!-- </div> -->
			</header>

			<hr class="opacity-50" />

			<!-- Content display, with HTML parsing or code block depending on type -->
			<div class="p-0">
				<!-- For regular content that might contain HTML -->
				<div class="paste-card card p-1 md:p-6 variant-filled-surface rounded-t-none rounded-md">
					<div class="prose dark:prose-invert max-w-none marker:text-white">
						{#if $currentPaste.editorType === 'code'}
							<CodeBlock
								language={$currentPaste.syntaxHighlight || 'javascript'}
								code={$currentPaste.content}
							/>
						{:else}
							{@html DOMPurify.sanitize($currentPaste.content)}
						{/if}
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
					<p>We couldn't find a paste with access ID: {accessId}</p>
					<a href="/" class="btn variant-soft-surface mt-4">Return to Home</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.float-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		transition: all 0.3s ease;
	}
	@media (min-width: 768px) {
		.float-button {
			top: 1rem;
			right: 2.5rem;
		}
	}
</style>
