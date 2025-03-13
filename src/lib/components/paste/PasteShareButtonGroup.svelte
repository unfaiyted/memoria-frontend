<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	interface PasteShareButtonGroupProps {
		handleEdit?: () => void | null;
		handleDelete?: () => Promise<void> | null;
		isDropDownEnabled: boolean;
	}
	const { handleEdit, handleDelete, isDropDownEnabled }: PasteShareButtonGroupProps = $props();

	const modal: ModalSettings = {
		type: 'component',
		component: 'newPasteModel',
		title: 'Share Paste',
		value: 'https://prt.ad/a39X2s (fake)',
		body: 'Share anytime with anyone!',
		response: () => {}
	};

	const handleShare = () => {
		const currentUrl = window.location.href;
		modalStore.trigger({ ...modal, value: currentUrl });
	};

	// Popup settings for the share dropdown
	const sharePopupSettings: PopupSettings = {
		event: 'click',
		target: 'sharePopup',
		placement: 'bottom-end'
	};
</script>

<div class="inline-flex">
	<!-- Share Button -->
	<button
		class="btn variant-filled-secondary rounded-l-md {isDropDownEnabled
			? 'rounded-r-none'
			: 'rounded-r-md'}"
		onclick={handleShare}
	>
		<svg
			class="h-4 w-4 mr-2"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
			/>
		</svg>
		Share
	</button>

	<!-- Dropdown Toggle Button -->
	{#if isDropDownEnabled}
		<button
			class="btn variant-filled-secondary border-l border-l-secondary-400 rounded-l-none rounded-r-md"
			use:popup={sharePopupSettings}
			aria-haspopup="true"
			aria-label="Share Popup"
		>
			<svg
				class="h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	{/if}
</div>

<!-- Popup Menu -->
<div class="card p-2 w-48 shadow-xl" data-popup="sharePopup">
	<div class="grid grid-cols-1 gap-2" role="menu">
		{#if handleEdit}
			<button
				class="btn btn-sm variant-ghost-surface flex items-center justify-start"
				role="menuitem"
				onclick={handleEdit}
			>
				<svg
					class="mr-2 h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
					/>
				</svg>
				Edit
			</button>
		{/if}
		{#if handleDelete}
			<button
				class="btn btn-sm variant-ghost-error flex items-center justify-start"
				role="menuitem"
				onclick={handleDelete}
			>
				<svg
					class="mr-2 h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
				Delete
			</button>
		{/if}
	</div>
	<div class="arrow bg-surface-100-800-token"></div>
</div>
