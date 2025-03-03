<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let sidebarOpen = true;

	function handleToggle(e) {
		sidebarOpen = e.detail.isOpen;
	}
</script>

<div class="flex min-h-screen overflow-hidden">
	<Toast />
	<div
		class={`w-[${sidebarOpen ? '280px' : '50px'}] transition-all min-v-screen  duration-300 ${sidebarOpen ? '' : '-translate-x-[0px]'}`}
	>
		<Sidebar bind:isOpen={sidebarOpen} on:toggle={handleToggle} />
	</div>
	<main
		class={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'pl-[250px]' : 'pl-5'}`}
	>
		<slot />
	</main>
</div>
