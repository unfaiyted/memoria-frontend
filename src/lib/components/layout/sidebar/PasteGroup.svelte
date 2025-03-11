<!-- PasteGroup.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { components } from '$lib/api/v1';
	import PasteItem from './PasteItem.svelte';

	type Paste = components['schemas']['models.Paste'];

	let {
		pastes = [] as Paste[],
		groupTitle = '',
		isOpen = false,
		variant = 'surface',
		onPasteClick = () => {}
	} = $props();
</script>

{#if pastes.length > 0}
	<div class="">
		{#if isOpen}
			<h2
				class="text-xs font-semibold uppercase tracking-wider mb-2"
				transition:fade={{ duration: 200 }}
			>
				{groupTitle}
			</h2>
		{:else}
			<div
				class="text-xs mx-auto text-center font-semibold mb-2 p-0 mt-0 w-full text-slate-500 max-h-[10px]"
				aria-label={groupTitle}
			>
				.
			</div>
		{/if}
		<ul class="space-y-1 first-of-type:pt-2">
			{#each pastes as paste (paste.id)}
				<PasteItem {paste} {isOpen} {onPasteClick} {variant} />
			{/each}
		</ul>
	</div>
{/if}
