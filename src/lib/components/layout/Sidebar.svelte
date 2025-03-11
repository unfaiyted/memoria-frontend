<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { pastesStore, pastes as pastesData, pastesLoading } from '$lib/stores/pastes';
	import { pasteStorage } from '$lib/data/storage';
	import PasteGroup from '$lib/components/layout/sidebar/PasteGroup.svelte';
	import { browser } from '$app/environment';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import type { components } from '$lib/api/v1';

	type Paste = components['schemas']['models.Paste'];

	// Props with defaults

	let { isOpen = $bindable(false), title = 'Memoria', onToggle } = $props();

	// State variables
	let windowWidth = $state(browser ? window.innerWidth : 1024);
	let searchQuery = $state('');
	let width = $state(isOpen ? 16 : 4); // Current width in rem
	let targetWidth = $state(isOpen ? 16 : 4); // Target width to animate to
	let animating = $state(false);
	let lastFetchTime = $state(0); // Track when we last fetched data
	let refreshInterval = 60000; // Refresh after 1 minute (adjust as needed)
	let initialFetchDone = $state(false);
	let searchInputElement = $state<HTMLInputElement | null>(null);
	let isPhoneSize = $state(false);
	// Derived state
	let filteredPastes = $derived(
		$pastesData.filter((paste) => paste.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	let adjustedWidth = $derived(isOpen && isPhoneSize ? 4 : width);

	// Constants
	const SMALL_SCREEN_BREAKPOINT = 850;
	const PHONE_BREAKPOINT = 630;
	const ANIMATION_DURATION = 300; // ms

	// Smart fetch function that only loads data if needed
	async function smartFetchPastes() {
		if ($pastesData.length === 0 || Date.now() - lastFetchTime > refreshInterval) {
			await pastesStore.fetchAllPublicPastes();

			const accessIds = pasteStorage.getPasteAccessIds();
			if (accessIds.length > 0) {
				await pastesStore.fetchAllPrivatePastes(accessIds);
			}
			lastFetchTime = Date.now();
		}
	}

	// Force refresh function for manual updates
	// function forceRefresh() {
	// 	pastesStore.fetchAllPastes();
	// 	lastFetchTime = Date.now();
	// }

	$effect(() => {
		// Update target width when isOpen changes
		targetWidth = isOpen ? 16 : 4;

		if (!animating && width !== targetWidth) {
			animateWidth();
		}
	});

	onNavigate(() => {
		// navigationComplete = false;
	});

	afterNavigate(() => {
		// navigationComplete = true;
		if (browser && initialFetchDone) {
			smartFetchPastes();
		}
	});

	// Custom animation function using requestAnimationFrame
	function animateWidth() {
		if (!browser) return;

		animating = true;
		const startTime = performance.now();
		const startWidth = width;
		const widthDiff = targetWidth - startWidth;

		function step(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

			// Cubic easing function (similar to cubicOut)
			const easedProgress = 1 - Math.pow(1 - progress, 3);

			// Update width with eased value
			width = startWidth + widthDiff * easedProgress;

			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				width = targetWidth; // Ensure we land exactly on target
				animating = false;
			}
		}

		requestAnimationFrame(step);
	}

	// Toggle sidebar function
	function toggleSidebar() {
		isOpen = !isOpen;
		onToggle?.({ isOpen });
	}

	// Handler for paste clicks
	interface GroupedPastes {
		private: Paste[];
		today: Paste[];
		yesterday: Paste[];
		older: Paste[];
	}

	// Group pastes by date
	function groupPastesByDate(pasteList: Paste[]): GroupedPastes {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// Get private access storage id's
		const privateAccessIds = pasteStorage.getPasteAccessIds();

		// Helper function to sort pastes by created_at in descending order
		const sortByDateDesc = (a: Paste, b: Paste) => {
			return new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime();
		};

		// identify private pastes
		const privatePastes = pasteList
			.filter(
				(paste) =>
					paste.privacy == 'private' && privateAccessIds.includes(paste.privateAccessId || '')
			)
			.sort(sortByDateDesc);

		return {
			private: privatePastes,
			today: pasteList
				.filter((paste) => new Date(paste.createdAt as string) >= today)
				.filter((paste) => paste.privacy != 'private')
				.sort(sortByDateDesc),
			yesterday: pasteList
				.filter(
					(paste) =>
						new Date(paste.createdAt as string) >= yesterday &&
						new Date(paste.createdAt as string) < today
				)
				.filter((paste) => paste.privacy != 'private')
				.sort(sortByDateDesc),
			older: pasteList
				.filter((paste) => new Date(paste.createdAt as string) < yesterday)
				.filter((paste) => paste.privacy != 'private')
				.sort(sortByDateDesc)
		};
	}

	let groupedPastes = $derived(groupPastesByDate(filteredPastes));

	function handlePasteClick() {
		if (windowWidth < SMALL_SCREEN_BREAKPOINT) {
			isOpen = false;
			onToggle?.({ isOpen });
		}
	}

	function handleSearchIconClick() {
		if (!isOpen) {
			isOpen = true;
			setTimeout(() => {
				searchInputElement?.focus();
			}, ANIMATION_DURATION);
		}
	}

	function handleNewPasteClick() {
		if (windowWidth < SMALL_SCREEN_BREAKPOINT) {
			isOpen = false;
			onToggle?.({ isOpen });
		}
	}

	// Setup code
	onMount(() => {
		const privateAccessIds = pasteStorage.getPasteAccessIds();
		pastesStore.fetchAllPublicPastes();
		pastesStore.fetchAllPrivatePastes(privateAccessIds);

		// Add window resize listener
		if (browser) {
			if (windowWidth < PHONE_BREAKPOINT) {
				isPhoneSize = true;
				isOpen = false;
			}
			if (windowWidth > PHONE_BREAKPOINT) {
				isPhoneSize = false;
			}

			const handleResize = () => {
				windowWidth = window.innerWidth;
				if (windowWidth < SMALL_SCREEN_BREAKPOINT) {
					isOpen = false;
				}
				if (windowWidth > SMALL_SCREEN_BREAKPOINT) {
					isOpen = true;
				}
				if (windowWidth < PHONE_BREAKPOINT) {
					isPhoneSize = true;
				}
				if (windowWidth > PHONE_BREAKPOINT) {
					isPhoneSize = false;
				}
			};

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	});
</script>

<aside
	class="sidebar fixed top-0 left-0 h-dvh flex flex-col
    border-r-2 border-surface-600 bg-surface-900 shadow-sm z-50"
	style="width: {width}rem"
>
	<div class="flex h-dvh flex-col overflow-hidden">
		<!-- Toggle Button -->
		<button
			class="absolute top-4 {isOpen
				? 'right-4'
				: 'right-4'} z-10 rounded-full p-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all"
			onclick={toggleSidebar}
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
		<div
			class="flex items-center {isOpen ? 'space-x-2' : 'justify-center'} mb-6"
			style="padding: {isOpen ? '0rem 1.5rem' : '0rem 0.5rem'};"
		>
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
				class={`${isOpen ? '' : 'opacity-0'} mt-4 lucide w-8 h-8 text-indigo-600`}
				><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"
				></path></svg
			>
			{#if isOpen}
				<h1
					transition:fade={{ duration: 200 }}
					class="text-xl font-semibold whitespace-nowrap overflow-hidden pt-4"
				>
					<a
						href="/"
						onclick={() => {
							isOpen = false;
						}}>{title}</a
					>
				</h1>
			{/if}
		</div>

		<!-- Search Bar -->
		<div
			class="{isOpen ? 'mb-4' : 'mb-0'} flex-shrink-0"
			style="padding: {isOpen ? '0rem 1.5rem' : '0rem 0.5rem'};"
		>
			{#if isOpen}
				<div transition:fade={{ duration: 200 }}>
					<div class="relative">
						<input
							type="text"
							placeholder="Search pastes..."
							bind:value={searchQuery}
							bind:this={searchInputElement}
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
				<button
					class="flex justify-center mb-4 w-full"
					aria-label="Search"
					onclick={handleSearchIconClick}
				>
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
		<div
			class="flex-1 overflow-y-auto min-h-0 w-[100%]"
			style="padding: {isOpen ? '0rem 1.5rem' : '0rem 0.5rem'};"
		>
			{#if $pastesLoading}
				<div class="text-center py-4">
					{#if isOpen}
						<p transition:fade={{ duration: 200 }}>Loading pastes...</p>
					{:else}
						<div class="flex justify-center">
							<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					{/if}
				</div>
			{:else}
				<div class="max-w-[210px]">
					<!-- Private -->
					<PasteGroup
						pastes={groupedPastes.private}
						groupTitle="Private"
						{isOpen}
						variant="primary"
						onPasteClick={handlePasteClick}
					/>

					<!-- Today -->
					<PasteGroup
						pastes={groupedPastes.today}
						groupTitle="Today"
						{isOpen}
						variant="primary"
						onPasteClick={handlePasteClick}
					/>

					<!-- Yesterday -->
					<PasteGroup
						pastes={groupedPastes.yesterday}
						groupTitle="Yesterday"
						{isOpen}
						onPasteClick={handlePasteClick}
					/>

					<!-- Older -->
					<PasteGroup
						pastes={groupedPastes.older}
						groupTitle="Older"
						{isOpen}
						onPasteClick={handlePasteClick}
					/>
				</div>

				<!-- No results message -->
				{#if filteredPastes.length === 0 && !$pastesLoading}
					<div class="text-center py-4 text-zinc-500 text-sm">
						{#if isOpen}
							<p transition:fade={{ duration: 200 }}>No pastes found</p>
						{/if}
					</div>
				{/if}
			{/if}
		</div>

		<!-- Create New Button -->
		<div style="padding: {isOpen ? '1rem 1.5rem' : '0.5rem 0.5rem'};">
			<div class="mt-6 pt-4 border-t-2 border-surface-500 flex-shrink-0">
				<a
					href="/new"
					onclick={handleNewPasteClick}
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
	</div>
</aside>
<div class="sidebar-spacer" style="width: {adjustedWidth}rem;"></div>

<style>
	.sidebar {
		/* transition: width 300ms cubic-bezier(0.22, 1, 0.36, 1); */
		z-index: 50;
	}
	/* Add these styles to fix popup positioning */
	:global([data-popup^='paste-']) {
		z-index: 100 !important; /* Higher than sidebar z-index */
		position: fixed !important; /* This ensures it's positioned relative to viewport */
		transform: translateX(0) !important; /* Ensure proper horizontal positioning */
	}

	:global([data-popup^='paste-'] .arrow) {
		z-index: 100 !important; /* Higher than sidebar z-index */
		left: -5px !important; /* Adjust arrow to point correctly */
	}
	.sidebar-spacer {
		height: 100vh;
		z-index: 1;
		float: left;
	}
</style>
