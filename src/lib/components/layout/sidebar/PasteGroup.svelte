<!-- PasteGroup.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	import type { components } from '$lib/api/v1';

	type Paste = components['schemas']['models.Paste'];

	let {
		pastes = [] as Paste[],
		groupTitle = '',
		isOpen = false,
		variant = 'surface',
		onPasteClick = () => {}
	} = $props();

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
</script>

{#if pastes.length > 0}
	<div class="mb-4">
		{#if isOpen}
			<h2
				class="text-xs font-semibold uppercase tracking-wider mb-2"
				transition:fade={{ duration: 200 }}
			>
				{groupTitle}
			</h2>
		{/if}
		<ul class="space-y-1">
			{#each pastes as paste (paste.id)}
				<li>
					<a
						href={`/paste/${paste.id}`}
						class="flex items-center rounded-md px-3 py-2 [&>*]:pointer-events-none hover:bg-indigo-50 hover:text-indigo-600 {isOpen
							? 'space-x-3'
							: 'justify-center'}"
						use:popup={getPastePopupSettings(paste.id)}
						onclick={(e) => handlePasteClick(e, paste.id)}
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
								class="whitespace-nowrap overflow-hidden text-ellipsis">{paste.title}</span
							>
						{/if}
					</a>
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
			{/each}
		</ul>
	</div>
{/if}
