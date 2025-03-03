<script>
	import Editor from '$lib/components/utils/editor/Editor.svelte';
	// Form state
	let title = '';
	let content = '';
	let expiration = '1d'; // Default: 1 day
	let password = '';
	let isPrivate = false;

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

	// Clipboard functions
	async function pasteFromClipboard() {
		try {
			const text = await navigator.clipboard.readText();
			content = text;
		} catch (err) {
			console.error('Failed to read clipboard contents:', err);
			alert('Unable to access clipboard. Make sure you have granted permission.');
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(content);
			alert('Content copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
			alert('Unable to copy to clipboard. Make sure you have granted permission.');
		}
	}
</script>

<svelte:head>
	<title>New Paste</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-4xl overflow-y">
	<h1 class="h1 pb-6">Create New Paste</h1>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
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

		<!-- Content Editor -->
		<div>
			<div class="flex justify-between items-center mb-1">
				<label for="content" class="label">Paste Content</label>
				<div class="flex space-x-2">
					<button
						type="button"
						class="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
						on:click={pasteFromClipboard}
					>
						Paste to
					</button>
					<button
						type="button"
						class="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
						on:click={copyToClipboard}
					>
						Copy from
					</button>
				</div>
			</div>

			<div class="card">
				<!-- Editor with content binding -->
				<Editor bind:value={content} />
				<footer class="card-footer border-t-2 border-surface-700">
					<em class="text-xs">Editor can handle code and color coding</em>
				</footer>
			</div>

			<!-- Message -->
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
			>
				Create Paste
			</button>
		</div>
	</form>
</div>
