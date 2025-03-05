<script lang="ts">
	import Editor from '$lib/components/utils/editor/Editor.svelte';
	import { pastesStore } from '$lib/stores/pastes';
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	// Form state
	let title = '';
	let content = '';
	let expiration = '1d'; // Default: 1 day
	let password = '';
	let isPrivate = false;
	let isLoading = false;

	// Expiration options
	const expirationOptions = [
		{ value: '30m', label: '30 Minutes' },
		{ value: '1h', label: '1 Hour' },
		{ value: '1d', label: '1 Day' },
		{ value: '1w', label: '1 Week' },
		{ value: '1m', label: '1 Month' },
		{ value: 'never', label: 'Never' }
	];

	// Calculate expiration date based on selected option
	function calculateExpiresAt(option: string) {
		if (option === 'never') return undefined;

		const now = new Date();
		switch (option) {
			case '30m':
				return new Date(now.getTime() + 30 * 60000).toISOString();
			case '1h':
				return new Date(now.getTime() + 60 * 60000).toISOString();
			case '1d':
				return new Date(now.getTime() + 24 * 60 * 60000).toISOString();
			case '1w':
				return new Date(now.getTime() + 7 * 24 * 60 * 60000).toISOString();
			case '1m':
				return new Date(now.getTime() + 30 * 24 * 60 * 60000).toISOString();
			default:
				return new Date(now.getTime() + 24 * 60 * 60000).toISOString();
		}
	}

	// Handle form submission
	async function handleSubmit() {
		try {
			isLoading = true;

			// Determine privacy setting
			let privacy = 'public';
			if (password) {
				privacy = 'password';
			} else if (isPrivate) {
				privacy = 'private';
			}

			const pasteData = {
				title,
				content,
				expires_at: calculateExpiresAt(expiration),
				privacy: privacy as 'public' | 'private' | 'password',
				syntax_highlight: 'auto' // Could implement language detection here
			};

			console.log('pasteData', pasteData);

			// Create paste using the store
			const result = await pastesStore.createPaste(pasteData);
			console.log('result', result);

			if (result) {
				toastStore.trigger({
					message: 'Paste created successfully!',
					background: 'variant-filled-success'
				});
				// Navigate to the new paste
				goto(`/paste/${result.id}`);
			}
		} catch (error) {
			toastStore.trigger({
				message: `Error creating paste: ${error.message || 'Unknown error'}`,
				background: 'variant-filled-error'
			});
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>New Paste</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-4xl overflow-y">
	<h2 class="h2 pb-4">Create New Paste</h2>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<!-- Content Editor -->
		<div>
			<div class="flex justify-between items-center mb-1">
				<div class="flex space-x-2">
					<!-- Buttons could be added here -->
				</div>
			</div>

			<div class="card">
				<!-- Editor with content binding -->
				<header class="pt-4 pl-4 mb-4">
					<div class="flex justify-between">
						<div>Press <kbd class="kbd">⌘ + V</kbd> to paste.</div>
						<div class="pr-4">
							<button class="chip variant-soft hover:variant-filled">
								<span
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 24 24"
										{...$$props}
										><!-- Icon from All by undefined - undefined --><path
											fill="currentColor"
											d="M7 19q-.825 0-1.412-.587T5 17q0-.375.15-.737t.45-.663l10-10q.3-.3.663-.45T17 5q.825 0 1.413.587T19 7q0 .375-.137.75t-.438.675l-10 10q-.3.3-.663.438T7 19"
										/></svg
									></span
								>
								<span>Clear</span>
							</button>
						</div>
					</div>
				</header>
				<div class="p-2 bg-surface-200-700-token">
					<Editor bind:value={content} />
				</div>
				<footer class="card-footer border-t-2 pt-3 border-surface-700">
					<em class="text-xs">Editor can handle code and color coding</em>
				</footer>
			</div>
		</div>
		<!-- Title and Expiration on same line -->
		<div class="flex flex-wrap gap-4">
			<!-- Title Input -->
			<div class="flex-1 min-w-[250px]">
				<label for="title" class="label mb-1">Title</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					placeholder="Enter a title for your paste"
					class="input"
					required
				/>
			</div>

			<!-- Expiration Options -->
			<div class="w-64">
				<label for="expiration" class="label mb-1">Expires After</label>
				<select id="expiration" bind:value={expiration} class="select">
					{#each expirationOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
		<!-- Password Protection and Privacy on same line -->
		<div class="flex flex-wrap gap-4 items-center">
			<!-- Password Protection -->
			<div class="flex-1 min-w-[250px]">
				<label for="password" class="label"> Password Protection (Optional) </label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Leave empty for no password"
					class="input password"
				/>
			</div>

			<!-- Privacy Toggle (for logged-in users) -->
			<div class="flex items-center self-end h-[42px]">
				<input
					id="private"
					type="checkbox"
					bind:checked={isPrivate}
					class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
				/>
				<label for="private" class="label pl-2"> Make paste private (only visible to you) </label>
			</div>
		</div>

		<!-- Submit Button -->
		<div>
			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				disabled={isLoading}
			>
				{#if isLoading}
					Creating...
				{:else}
					Create Paste
				{/if}
			</button>
		</div>
	</form>
</div>
