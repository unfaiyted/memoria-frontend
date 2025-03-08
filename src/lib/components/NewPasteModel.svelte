<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { ListBox, ListBoxItem, getModalStore, clipboard } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response();
		modalStore.close();
	}

	function onCancel(e) {
		e.preventDefault();
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl max-w-[400px] space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="variant-ghost-success {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>

		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				type="text"
				disabled
				value={$modalStore[0].value ?? '(missing)'}
				data-clipboard="pasteLink"
			/>
			<button class="border-l-2 border-surface-500" use:clipboard={{ input: 'pasteLink' }}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					{...$$props}
					><!-- Icon from All by undefined - undefined --><path
						fill="currentColor"
						d="m18 21l-1.4-1.425L18.175 18H12v-2h6.175L16.6 14.4L18 13l4 4zm3-10h-2V5h-2v3H7V5H5v14h5v2H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5zm-9-6q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"
					/></svg
				></button
			>
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={onCancel}>{parent.buttonTextCancel}</button>

        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>View Paste</button>
    </footer>
	</div>
{/if}
