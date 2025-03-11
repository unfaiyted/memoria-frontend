<script lang="ts">
	import Icon from '$lib/components/utils/Icon.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { pasteStorage } from '$lib/data/storage';
	import { pastesStore } from '$lib/stores/pastes';

	let { paste, isOpen, onPasteClick, variant } = $props();
	let isHovering = $state(false);
	let isActive = $derived(
		page.url.pathname === `/paste/${paste.id}` ||
			(paste.privateAccessId && page.url.pathname === `/paste/private/${paste.privateAccessId}`)
	);

	function getPastePopupSettings(pasteId: string | number): PopupSettings {
		return {
			event: 'hover',
			target: `paste-${pasteId}`,
			placement: 'right'
		};
	}

	function handlePasteClick(event: MouseEvent, pasteId: string | number) {
		onPasteClick?.(pasteId);
	}

	function handleDeletePaste(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (paste.privacy === 'private' && paste.privateAccessId) {
			// Remove from local storage
			pasteStorage.removeAccessId(paste.privateAccessId);

			// Remove from store
			pastesStore.update((state) => ({
				...state,
				pastes: state.pastes.filter((p) => p.id !== paste.id)
			}));
		}
	}
</script>

<li
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => {
		isHovering = false;
	}}
	class="relative ml-0 !pl-0"
>
	<a
		href={paste.privacy == 'public'
			? `/paste/${paste.id}`
			: `/paste/private/${paste.privateAccessId}`}
		class="flex button items-center rounded-md px-3 py-2 [&>*]:pointer-events-none hover:bg-indigo-50 {isHovering &&
		!isActive
			? 'bg-indigo-50 text-indigo-600'
			: ''} {isActive
			? `bg-indgo-100 text-indigo-500 font-medium bg-indigo-200/5`
			: ``} hover:text-indigo-600 {isOpen ? 'space-x-3' : 'justify-center'}"
		use:popup={getPastePopupSettings(paste.id)}
		onclick={(e) => handlePasteClick(e, paste.id)}
	>
		<Icon selected={`lang-${paste.syntaxHighlight}`} />
		{#if isOpen}
			<span
				transition:fade={{ duration: 200 }}
				class="whitespace-nowrap overflow-hidden text-ellipsis">{paste.title}</span
			>
		{/if}
	</a>

	<!-- Delete button for private pastes -->
	{#if paste.privacy === 'private' && isHovering && isOpen}
		<button
			onclick={handleDeletePaste}
			class="delete-btn absolute top-1 right-1 rounded-full w-5 h-5 mt-1.5 mr-1 flex items-center justify-center bg-error-300 hover:bg-error-400 text-error-50 text-xs"
			aria-label="Delete paste"
		>
			✕
		</button>
	{/if}
	<!-- Popup content for this paste -->
	<div
		class="card p-2 variant-filled-{variant} {isOpen
			? 'hidden opacity-0 invisible'
			: 'whitespace-nowrap max-w-[200px] z-50'}"
		data-popup={`paste-${paste.id}`}
	>
		<p class="text-sm">{paste.title}</p>
		<div class="arrow variant-filled-{variant}"></div>
	</div>
</li>

<style>
	.delete-btn {
		opacity: 0.8;
		transition: opacity 0.2s;
		z-index: 10;
	}

	.delete-btn:hover {
		opacity: 1;
	}
</style>
