<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Props with defaults
	export let isOpen = true;
	export let title = 'Memoria';

	// Create a tweened store for smooth width animation
	const width = tweened(isOpen ? 16 : 4, {
		duration: 300,
		easing: cubicOut
	});

	// Update width when isOpen changes
	$: width.set(isOpen ? 16 : 4);

	// Toggle sidebar function
	function toggleSidebar() {
		isOpen = !isOpen;
		dispatch('toggle', { isOpen });
	}

	// Mock data for paste history - this would come from your API in a real app
	let pastes = [
		{ id: 1, name: 'React Component', content: '...', created: new Date() },
		{ id: 2, name: 'SQL Query', content: '...', created: new Date(Date.now() - 1000 * 60 * 60) },
		{
			id: 3,
			name: 'Python Script',
			content: '...',
			created: new Date(Date.now() - 1000 * 60 * 60 * 3)
		},
		{
			id: 4,
			name: 'CSS Animation',
			content: '...',
			created: new Date(Date.now() - 1000 * 60 * 60 * 24)
		},
		{
			id: 5,
			name: 'Node.js Server',
			content: '...',
			created: new Date(Date.now() - 1000 * 60 * 60 * 25)
		},
		{
			id: 6,
			name: 'API Endpoints',
			content: '...',
			created: new Date(Date.now() - 1000 * 60 * 60 * 48)
		},
		{
			id: 7,
			name: 'Vue Component',
			content: '...',
			created: new Date(Date.now() - 1000 * 60 * 60 * 72)
		}
	];

	// Search functionality
	let searchQuery = '';
	$: filteredPastes = pastes.filter((paste) =>
		paste.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Group pastes by time period
	$: groupedPastes = groupPastesByDate(filteredPastes);

	function groupPastesByDate(pasteList) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		return {
			today: pasteList.filter((paste) => paste.created >= today),
			yesterday: pasteList.filter((paste) => paste.created >= yesterday && paste.created < today),
			older: pasteList.filter((paste) => paste.created < yesterday)
		};
	}
</script>

<aside
	class="sidebar fixed top-0 left-0 h-screen overflow-hidden
  border-r-2 border-surface-600 bg-surface-900 shadow-sm"
	style="width: {$width}rem"
>
	<div class="flex h-full flex-col" style="padding: {isOpen ? '1.5rem' : '0.5rem'};">
		<!-- Toggle Button -->
		<button
			class="absolute top-4 {isOpen
				? 'right-4'
				: 'right-4'} z-10 rounded-full p-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all"
			on:click={toggleSidebar}
			aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={isOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
				/>
			</svg>
		</button>

		<!-- Logo/Brand -->
		<div class="flex items-center {isOpen ? 'space-x-2' : 'justify-center'} mb-6">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class={`${isOpen ? '' : 'opacity-0'} lucide w-8 h-8 text-indigo-600`}
				><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"
				></path></svg
			>
			{#if isOpen}
				<h1
					transition:fade={{ duration: 200 }}
					class="text-xl font-semibold whitespace-nowrap overflow-hidden"
				>
					{title}
				</h1>
			{/if}
		</div>

		<!-- Search Bar -->
		<div class="mb-4 flex-shrink-0">
			{#if isOpen}
				<div transition:fade={{ duration: 200 }}>
					<div class="relative">
						<input
							type="text"
							placeholder="Search pastes..."
							bind:value={searchQuery}
							class="input w-full border py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
						<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg
								class="h-4 w-4 text-zinc-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						</div>
					</div>
				</div>
			{:else}
				<button class="flex justify-center mb-4 w-full">
					<svg class="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</button>
			{/if}
		</div>

		<!-- Paste History -->
		<div class="flex-1 overflow-y-auto min-h-0">
			<!-- Today -->
			{#if groupedPastes.today.length > 0}
				<div class="mb-4">
					{#if isOpen}
						<h2
							class="text-xs font-semibold uppercase tracking-wider mb-2"
							transition:fade={{ duration: 200 }}
						>
							Today
						</h2>
					{/if}
					<ul class="space-y-1">
						{#each groupedPastes.today as paste (paste.id)}
							<li>
								<a
									href={`/paste/${paste.id}`}
									class="flex items-center rounded-md px-3 py-2 hover:bg-indigo-50 hover:text-indigo-600 {isOpen
										? 'space-x-3'
										: 'justify-center'}"
								>
									<svg
										class="h-5 w-5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									{#if isOpen}
										<span
											transition:fade={{ duration: 200 }}
											class="whitespace-nowrap overflow-hidden text-ellipsis">{paste.name}</span
										>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Yesterday -->
			{#if groupedPastes.yesterday.length > 0}
				<div class="mb-4">
					{#if isOpen}
						<h2
							class="text-xs font-semibold uppercase tracking-wider mb-2"
							transition:fade={{ duration: 200 }}
						>
							Yesterday
						</h2>
					{/if}
					<ul class="space-y-1">
						{#each groupedPastes.yesterday as paste (paste.id)}
							<li>
								<a
									href={`/paste/${paste.id}`}
									class="flex items-center rounded-md px-3 py-2 hover:bg-indigo-50 hover:text-indigo-600 {isOpen
										? 'space-x-3'
										: 'justify-center'}"
								>
									<svg
										class="h-5 w-5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									{#if isOpen}
										<span
											transition:fade={{ duration: 200 }}
											class="whitespace-nowrap overflow-hidden text-ellipsis">{paste.name}</span
										>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Older -->
			{#if groupedPastes.older.length > 0}
				<div class="mb-4">
					{#if isOpen}
						<h2
							class="text-xs font-semibold uppercase tracking-wider mb-2"
							transition:fade={{ duration: 200 }}
						>
							Older
						</h2>
					{/if}
					<ul class="space-y-1">
						{#each groupedPastes.older as paste (paste.id)}
							<li>
								<a
									href={`/paste/${paste.id}`}
									class="flex items-center rounded-md px-3 py-2 hover:bg-indigo-50 hover:text-indigo-600 {isOpen
										? 'space-x-3'
										: 'justify-center'}"
								>
									<svg
										class="h-5 w-5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									{#if isOpen}
										<span
											transition:fade={{ duration: 200 }}
											class="whitespace-nowrap overflow-hidden text-ellipsis">{paste.name}</span
										>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- No results message -->
			{#if filteredPastes.length === 0}
				<div class="text-center py-4 text-zinc-500 text-sm">
					{#if isOpen}
						<p transition:fade={{ duration: 200 }}>No pastes found</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Create New Button -->
		<div class="mt-6 pt-4 border-t border-surface-200 flex-shrink-0">
			<a
				href="/new"
				class="flex items-center justify-center py-2 px-4 bg-indigo-600
        hover:bg-indigo-700 rounded-md text-white {isOpen ? '' : 'w-full'}"
			>
				<svg
					class="h-5 w-5 {isOpen ? 'mr-2' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
					></path>
				</svg>
				{#if isOpen}
					<span transition:fade={{ duration: 200 }}>New Paste</span>
				{/if}
			</a>
		</div>
	</div>
</aside>

<style>
	.sidebar {
		transition: width 300ms cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 50;
	}
</style>
