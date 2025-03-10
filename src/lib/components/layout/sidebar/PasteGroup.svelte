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
				<PasteItem {paste} {isOpen} {onPasteClick} {variant} />
			{/each}
		</ul>
	</div>
{/if}
