<script>
	import Editor from '$lib/components/utils/Editor.svelte';
	// Form state
	let title = '';
	let content = '';
	let expiration = '1d'; // Default: 1 day
	let password = '';
	let isPrivate = false;
	let showPreview = false;

	// Expiration options
	const expirationOptions = [
		{ value: '30m', label: '30 Minutes' },
		{ value: '1h', label: '1 Hour' },
		{ value: '1d', label: '1 Day' },
		{ value: '1w', label: '1 Week' },
		{ value: '1m', label: '1 Month' },
		{ value: 'never', label: 'Never' }
	];

	// Handle form submission
	function handleSubmit() {
		const pasteData = {
			title,
			content,
			expiration,
			password: password.length > 0 ? password : null,
			isPrivate
		};

		console.log('Submitting paste:', pasteData);
		// API call would go here
	}
</script>

<svelte:head>
	<title>Create New Paste</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-4xl overflow-y">
	<h1 class="h1">Create New Paste</h1>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<!-- Title Input -->
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				placeholder="Enter a title for your paste"
				class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
			/>
		</div>

		<!-- Content Editor -->
		<div>
			<div class="flex justify-between items-center mb-1">
				<label for="content" class="block text-sm font-medium text-gray-700">Content</label>
				<div class="flex space-x-2">
					<button
						type="button"
						class={`px-3 py-1 text-xs rounded ${!showPreview ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
						on:click={() => (showPreview = false)}
					>
						Edit
					</button>
					<button
						type="button"
						class={`px-3 py-1 text-xs rounded ${showPreview ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
						on:click={() => (showPreview = true)}
					>
						Preview
					</button>
				</div>
			</div>

			<div class="border border-gray-300 rounded-md shadow-sm overflow-hidden">
				<!-- Editor Toolbar -->
				<!-- <div class="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1"></div> -->
				{#if !showPreview}
					<Editor />
				{:else}
					<!-- Preview area -->
					<div class="w-full min-h-[300px] p-4 bg-white prose max-w-none"></div>
				{/if}
			</div>
			<p class="text-xs text-gray-500 mt-1">
				Supports Markdown and code highlighting. Use ```language for code blocks.
			</p>
		</div>

		<!-- Expiration Options -->
		<div>
			<label for="expiration" class="block text-sm font-medium text-gray-700 mb-1"
				>Expires After</label
			>
			<select
				id="expiration"
				bind:value={expiration}
				class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
			>
				{#each expirationOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<!-- Password Protection -->
		<div>
			<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
				Password Protection (Optional)
			</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Leave empty for no password"
				class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
			/>
		</div>

		<!-- Privacy Toggle (for logged-in users) -->
		<div class="flex items-center">
			<input
				id="private"
				type="checkbox"
				bind:checked={isPrivate}
				class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
			/>
			<label for="private" class="ml-2 block text-sm text-gray-700">
				Make paste private (only visible to you)
			</label>
		</div>

		<!-- Submit Button -->
		<div>
			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Create Paste
			</button>
		</div>
	</form>
</div>
